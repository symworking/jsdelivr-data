// Globale Variablen

document.addEventListener("DOMContentLoaded", async function () {
  // console.log("📦 DOM ist geladen.");

  loadScript("https://unpkg.com/emoji-blast/dist/global.js");

  try {
    const { data: member } = await window.$memberstackDom.getCurrentMember();
    // console.log("👤 Aktueller Member:", member);

    if (member) {
      const customFields = member.customFields || {};
      // console.log("📝 customFields:", customFields);

      let abgehakte_aktivitaeten = customFields.abgehakt || [];
      // console.log("📋 Aktuelle abgehakte_aktivitaeten:", abgehakte_aktivitaeten);

      // Alle Aktivitäten durchgehen
      const aktivitaeten = document.querySelectorAll(".aktivitaet-item-column");
      // console.log("📋 aktivitaeten:", aktivitaeten);

      let anzahl = 0;

      if (Array.isArray(abgehakte_aktivitaeten)) {
        // Wenn es ein Array ist – direkt zählen
        anzahl = abgehakte_aktivitaeten.filter(e => e && e.trim() !== "").length;
      } else if (typeof abgehakte_aktivitaeten === "string") {
        // Wenn es doch ein String ist – aufsplitten und zählen
        anzahl = abgehakte_aktivitaeten
          .split(",")
          .map(e => e.trim())
          .filter(e => e !== "").length;
      }

      const output = document.getElementById("abgehakt-count");
      if (output) {
      	if (anzahl > 0) {
        	if (anzahl == 1) {
            output.innerText = `Du hast eine Aktivität durchgeführt.`;
          } else {
            output.innerText = `Du hast ${anzahl} Aktivitäten durchgeführt.`;
          }
        } else {
          output.innerText = `Du hast bisher noch keine Aktivität durchgeführt. Schade!`;
        }
      }

      let anzahlNichtAbgehakt = 0;

      // --------------------------------------------------------------------
      // Zufällige Auswahl von 6 offenen Aktivitäten aus den ersten 10
      // --------------------------------------------------------------------
      const offeneKandidatenIDs = [];
      aktivitaeten.forEach((aktivitaetEl) => {
        const idTmp = aktivitaetEl.getAttribute("data-webflow-aktivitaet-id");
        const istAbgehaktTmp = Array.isArray(abgehakte_aktivitaeten)
          ? abgehakte_aktivitaeten.includes(idTmp)
          : false;
        const istAbgehaktViewTmp = aktivitaetEl.getAttribute("data-view-abgehakt");
        if (
          !istAbgehaktTmp &&
          !istAbgehaktViewTmp &&
          offeneKandidatenIDs.length < 10
        ) {
          offeneKandidatenIDs.push(idTmp);
        }
      });

      const behaltenOffeneIDs = new Set();
      while (behaltenOffeneIDs.size < Math.min(6, offeneKandidatenIDs.length)) {
        const idx = Math.floor(Math.random() * offeneKandidatenIDs.length);
        behaltenOffeneIDs.add(offeneKandidatenIDs[idx]);
      }
      // --------------------------------------------------------------------

      aktivitaeten.forEach((aktivitaetEl) => {
        // console.log("📋 aktivitaetEl:", aktivitaetEl);
        const itemID = aktivitaetEl.getAttribute("data-webflow-aktivitaet-id");
        // console.log("📋 itemID:", itemID);
        const button = aktivitaetEl.querySelector(".button-cta");
        // console.log("📋 button:", button);
        const doneMsg = aktivitaetEl.querySelector(".button-cta-gray");
        // console.log("📋 doneMsg:", doneMsg);

        const istBereitsAbgehakt = abgehakte_aktivitaeten.includes(itemID); // NEU
        const istAbgehaktView   = aktivitaetEl.getAttribute("data-view-abgehakt"); // NEU

        // ----------------------------------------------------------------
        // Entferne offene Elemente, wenn sie NICHT zu den
        // zufällig selektierten 6 aus den ersten 10 gehören
        // ----------------------------------------------------------------
        if (!istBereitsAbgehakt && !istAbgehaktView) {
          if (!behaltenOffeneIDs.has(itemID)) {
            aktivitaetEl.remove();
            return;
          }
          anzahlNichtAbgehakt++;
        }
        // ----------------------------------------------------------------
        
        if (abgehakte_aktivitaeten.includes(itemID)) {
        	if (!aktivitaetEl.getAttribute("data-view-abgehakt")) {
            aktivitaetEl.remove();
          }
          button.style.display = "none";
          doneMsg.style.display = "block";
        } else {
        	if (aktivitaetEl.getAttribute("data-view-abgehakt")) {
            aktivitaetEl.remove();
          }
          button.addEventListener("click", async function () {
            // Keine Animation für Georg für die demo! :-)
            if (member.id !== "mem_cm9m1f1xs00ap0wr48i2e6mm0") {
              const position = button.getBoundingClientRect();
              emojiBlast({
                emojis: ["🌹", "💐", "🌸", "🌺", "🌷", "🌻", "🪻"],
                position: {
				  				x: position.left + aktivitaetEl.clientWidth / 2,
					  		  y: position.top
						  	},
						  });
            }
            if (!abgehakte_aktivitaeten.includes(itemID)) {
              abgehakte_aktivitaeten.push(itemID);
              await window.$memberstackDom.updateMember({
                customFields: {
                  abgehakt: abgehakte_aktivitaeten
                }
              });
              // UI anpassen
              button.style.display = "none";
              doneMsg.style.display = "block";
            }
          });
        }
      });

      // ------------------------------------------------------------
      // Seiten-Besuche zählen (per localStorage)
      // ------------------------------------------------------------
      totalPageVisits = parseInt(member.customFields["total-page-visits"] || "0", 10) + 1;
      currentPageVisits = parseInt(localStorage.getItem(window.location.pathname) || "0", 10) + 1;
      // 🔧 Wert in Memberstack bzw. im Local Storage speichern
      await window.$memberstackDom.updateMember({
        customFields: {"total-page-visits": totalPageVisits}
      });
      localStorage.setItem(window.location.pathname, currentPageVisits);
      // ------------------------------------------------------------

      document.querySelectorAll('.star-rating').forEach(initStarRating);
    } else {
      console.log("⚠️ Kein Member eingeloggt.");
    }
  } catch (error) {
    console.error("❌ Fehler beim Ausführen des Memberstack-Codes:", error);
  }
});

// --------------------------------------------------------------
// Hilfsfunktion zum anzeigen des Sterne Bewertungs Modals
// --------------------------------------------------------------
function viewStarRatingModal() {
  const modal = document.getElementById("star-rating-modal-wrapper");
  if (modal) modal.classList.remove("display-none");
}
// --------------------------------------------------------------

function initStarRating(wrapper){
  const stars  = [...wrapper.querySelectorAll('.star')];
  const valueInput = wrapper.querySelector('input[name="Bewertung"]');
  const form   = wrapper.closest('form');
  let current  = +valueInput.value || 0;

  // Modal-Form-Wrapper mit Trigger-Daten lesen
  const formWrapper = form.closest(".star-rating-modal-form"); // erwartet: data-Attribute am Wrapper
  const modalWrapper = formWrapper?.closest(".star-rating-modal-wrapper");

  // Die Trigger-Attribute auslesen
  const triggerType = formWrapper?.getAttribute("data-feedback-trigger-type");
  const triggerCount = parseInt(formWrapper?.getAttribute("data-feedback-trigger-count") || "0", 10);

  const sollAnzeigen =
    (triggerType === "Seitenaufrufe insgesamt" && totalPageVisits === triggerCount) ||
    (triggerType === "Seitenaufrufe einer URL" && currentPageVisits === triggerCount);

  if (sollAnzeigen && modalWrapper) {
    modalWrapper.classList.remove("display-none");
  }

  /* 1 | Visuelle + ARIA-Initialisierung */
  wrapper.setAttribute('role','radiogroup');
  stars.forEach((star,i)=>{
    const val=i+1;
    star.setAttribute('role','radio');
    star.setAttribute('aria-checked','false');

    star.addEventListener('mouseenter', ()=>paint(val));
    star.addEventListener('mouseleave', ()=>paint(current));

    const choose = ()=>{
      current = val;
      valueInput.value = current;   // ❶ an Form übergeben
      paint(current);
      /* Modal-Wrapper nach erfolgreicher Submission verstecken */
      modalWrapper.classList.add('display-none');
      /* ❷ sofort absenden – bevorzugt modernes requestSubmit() */
      if(form.requestSubmit){ form.requestSubmit(); }
      else                  { form.submit();       }
    };
    star.addEventListener('click',  choose);
    star.addEventListener('keyup',e=>{
      if(e.key==='Enter'||e.key===' ') choose();
    });
  });
  paint(current);
  
  function paint(r){
    stars.forEach((s,idx)=>{
      const filled = idx < r;
      s.classList.toggle('filled',filled);
      s.setAttribute('aria-checked',filled);
    });
  }
}
