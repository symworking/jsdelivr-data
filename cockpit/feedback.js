// Globale Variablen

document.addEventListener("DOMContentLoaded", async function () {
  // console.log("📦 DOM ist geladen.");

  try {
    const { data: member } = await window.$memberstackDom.getCurrentMember();
    // console.log("👤 Aktueller Member:", member);

    if (member) {
      const customFields = member.customFields || {};
      // console.log("📝 customFields:", customFields);

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
      s.style.color = filled ? '#ffbf00' : '';
      s.setAttribute('aria-checked',filled);
    });
  }
}
