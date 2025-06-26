document.addEventListener("DOMContentLoaded", async function () {
  // console.log("📦 DOM ist geladen.");
  try {
    const { data: member } = await window.$memberstackDom.getCurrentMember();
    // console.log("👤 Aktueller Member:", member);

    if (member) {
      const customFields = member.customFields || {};
      // console.log("📝 customFields:", customFields);

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
    } else {
      console.log("⚠️ Kein Member eingeloggt.");
    }
  } catch (error) {
    console.error("❌ Fehler beim Ausführen des Memberstack-Codes:", error);
  }
});
