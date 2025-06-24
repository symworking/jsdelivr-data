
document.addEventListener("DOMContentLoaded", async function () {
  // console.log("📦 DOM ist geladen.");
  function loadScript(file) {
    const newScript = document.createElement('script');
    newScript.setAttribute('src', file);
    newScript.setAttribute('type', 'text/javascript');
    newScript.setAttribute('async', 'true');

    newScript.onload = () => console.log(`${file} loaded successfully.`);
    newScript.onerror = () => console.error(`Error loading script: ${file}`);

    document.head.appendChild(newScript);
  }

  // --------------------------------------------------------------
  // Hilfsfunktion zum anzeigen des Sterne Bewertungs Modals
  // --------------------------------------------------------------
  function viewStarRatingModal() {
    const modal = document.getElementById("star-rating-modal-wrapper");
    if (modal) modal.classList.remove("display-none");
  }
  // --------------------------------------------------------------

  loadScript("https://unpkg.com/emoji-blast/dist/global.js");


  try {
    const { data: member } = await window.$memberstackDom.getCurrentMember();
    console.log("👤 Aktueller Member:", member);

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
      const offeneKandidatenIDs = [];                                               // NEU2
      aktivitaeten.forEach((aktivitaetEl) => {                                      // NEU2
        const idTmp = aktivitaetEl.getAttribute("data-webflow-aktivitaet-id");      // NEU2
        const istAbgehaktTmp = Array.isArray(abgehakte_aktivitaeten)                // NEU2
          ? abgehakte_aktivitaeten.includes(idTmp)                                  // NEU2
          : false;                                                                  // NEU2
        const istAbgehaktViewTmp = aktivitaetEl.getAttribute("data-view-abgehakt"); // NEU2
        if (                                                                  // NEU2
          !istAbgehaktTmp &&                                                  // NEU2
          !istAbgehaktViewTmp &&                                              // NEU2
          offeneKandidatenIDs.length < 10                                     // NEU2
        ) {                                                                   // NEU2
          offeneKandidatenIDs.push(idTmp);                                    // NEU2
        }                                                                     // NEU2
      });                                                                     // NEU2

      const behaltenOffeneIDs = new Set();                                    // NEU2
      while (behaltenOffeneIDs.size < Math.min(6, offeneKandidatenIDs.length)) { // NEU2
        const idx = Math.floor(Math.random() * offeneKandidatenIDs.length);   // NEU2
        behaltenOffeneIDs.add(offeneKandidatenIDs[idx]);                       // NEU2
      }                                                                       // NEU2
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
        if (!istBereitsAbgehakt && !istAbgehaktView) {          // NEU2
          if (!behaltenOffeneIDs.has(itemID)) {                 // NEU2
            aktivitaetEl.remove();                              // NEU2
            return;                                             // NEU2 – Rest überspringen
          }                                                     // NEU2
          anzahlNichtAbgehakt++;                                // NEU2 (nur noch Statistik)
        }                                                       // NEU2
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

      // Alle Elemente mit Klasse .zitat-item (aus dem Feld Name)
      const zitatElemente = Array.from(document.querySelectorAll("#zitate-item"));
      const zitatElementeName = Array.from(document.querySelectorAll("#zitate-item-name"));
      const zitatElementeAutor = Array.from(document.querySelectorAll("#zitate-item-autor"));
      // console.log("zitatElemente:", zitatElemente);

      if (zitatElemente.length > 0) {
        const zufallsIndex = Math.floor(Math.random() * zitatElemente.length);
        const zitat = zitatElementeName[zufallsIndex].textContent.trim();
        const autor = zitatElementeAutor[zufallsIndex].textContent.trim();

        const ausgabeFeld = document.getElementById("Inspiration-Zitat");
        // console.log("ausgabeFeld:", ausgabeFeld);
        if (ausgabeFeld) {
          ausgabeFeld.textContent = zitat;
          // console.log("ausgabeFeld.textContent:", ausgabeFeld.textContent);
        }
        const autorFeld = document.getElementById("Inspiration-Zitat-Autor");
        // console.log("autorFeld:", autorFeld);
        if (autorFeld) {
          autorFeld.textContent = autor;
          // console.log("autorFeld.textContent:", autorFeld.textContent);
        }
      }
      // ------------------------------------------------------------
      // Seiten-Besuche zählen (per localStorage)
      // ------------------------------------------------------------
      let visits = 0;                                                // NEU4
      visits = parseInt(localStorage.getItem("visits") || "0", 10) + 1; // NEU4
      console.log("visits: ", visits);
      if (visits === 5) { viewStarRatingModal(); }                 // NEU4
      localStorage.setItem("visits", visits);                      // NEU4
      // ------------------------------------------------------------

    } else {
      console.log("⚠️ Kein Member eingeloggt.");
    }
  } catch (error) {
    console.error("❌ Fehler beim Ausführen des Memberstack-Codes:", error);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.star-rating').forEach(initStarRating);
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
		  const modal = document.getElementById("star-rating-modal-wrapper");
		  if(modal) modal.classList.add('display-none');
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
