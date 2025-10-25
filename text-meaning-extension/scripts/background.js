chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Word Meaning Finder background script active.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchWordData") {
    const word = message.word.trim().toLowerCase();
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error("Word not found");
        return response.json();
      })
      .then(data => {
        const entry = data[0];
        const meaning = entry.meanings?.[0]?.definitions?.[0]?.definition || "No meaning found.";
        const synonyms = entry.meanings?.[0]?.synonyms?.slice(0, 5) || [];
        const antonyms = entry.meanings?.[0]?.antonyms?.slice(0, 5) || [];
        sendResponse({ meaning, synonyms, antonyms });
      })
      .catch(error => {
        console.error("Error fetching word data:", error);
        sendResponse({ error: "Unable to fetch data." });
      });

    return true;
  }
});
