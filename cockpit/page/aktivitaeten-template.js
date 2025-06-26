document.addEventListener("DOMContentLoaded", async function () {
    console.log("📦 DOM ist geladen.");
  
    try {
      const { data: member } = await window.$memberstackDom.getCurrentMember();
      console.log("👤 Aktueller Member:", member);
  
      if (member) {
        const customFields = member.customFields || {};
        console.log("📝 customFields:", customFields);
  
        let abgehakte_aktivitaeten = customFields.abgehakt || [];
        console.log("📋 Aktuelle abgehakte_aktivitaeten:", abgehakte_aktivitaeten);
  
        // CMS-Feld lesen
        const itemID = "{{wf {&quot;path&quot;:&quot;aktivitaetwebflowid&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}";
        console.log("🎯 Aktuelle Aktivität-ID:", itemID);
  
        if (abgehakte_aktivitaeten.includes(itemID)) {
          console.log("✅ Diese Aktivität wurde bereits abgehakt.");
          document.getElementById("Aktivitaet-abhaken").style.display = "none";
          document.getElementById("Aktivitaet-abgehakt").style.display = "block";
        } else {
          console.log("🎯 Diese Aktivität wurde noch nicht abgehakt.");
        }
  
        document.getElementById("Aktivitaet-abhaken").addEventListener("click", async function () {
          console.log("📌 Button geklickt.");
          if (!abgehakte_aktivitaeten.includes(itemID)) {
            abgehakte_aktivitaeten.push(itemID);
            console.log("🆕 Neue Liste abgehakt:", abgehakte_aktivitaeten);
  
            await window.$memberstackDom.updateMember({
              customFields: {
                'abgehakt': abgehakte_aktivitaeten
              }
            });
  
            console.log("✅ Memberdaten aktualisiert.");
            document.getElementById("Aktivitaet-abhaken").style.display = "none";
            document.getElementById("Aktivitaet-abgehakt").style.display = "block";
          }
        });
      } else {
        console.log("⚠️ Kein Member eingeloggt.");
      }
    } catch (error) {
      console.error("❌ Fehler beim Ausführen des Memberstack-Codes:", error);
    }
  });