window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
  const abgehakt = member.customFields.abgehakt;
  let anzahl = 0;

  // Emoji-Liste: Index = Anzahl (1-basiert)
  const emojiMap = [
    "😔",       // 0 (kein Emoji)
    "🙂",     // 1
    "👍",     // 2
    "✅",     // 3
    "💪",     // 4
    "🎯",     // 5
    "🔥",     // 6
    "😃",     // 7
    "🌟",     // 8
    "🥳",     // 9
    "🚀"      // 10 oder mehr
  ];

  if (Array.isArray(abgehakt)) {
    // Wenn es ein Array ist – direkt zählen
    anzahl = abgehakt.filter(e => e && e.trim() !== "").length;
  } else if (typeof abgehakt === "string") {
    // Wenn es doch ein String ist – aufsplitten und zählen
    anzahl = abgehakt
      .split(",")
      .map(e => e.trim())
      .filter(e => e !== "").length;
  }

  const output = document.getElementById("abgehakt-count");
  if (output) {
    const emoji = emojiMap[Math.min(anzahl, 10)];
    output.innerText = `${anzahl}${emoji}`;
  }
});
