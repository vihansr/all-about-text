const api_key = "jxEqs1rPZX8cxDvWFVSLkw==7aPU5lGq8TV5dvrI";

// Fetch synonyms from Datamuse
async function fetchSynonyms(word) {
  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
    const data = await response.json();
    return data.slice(0, 4).map(item => item.word);
  } catch (err) {
    console.error(err);
    return ["Error fetching synonyms"];
  }
}

// Fetch antonyms from Datamuse
async function fetchAntonyms(word) {
  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_ant=${word}`);
    const data = await response.json();
    return data.slice(0, 4).map(item => item.word);
  } catch (err) {
    console.error(err);
    return ["Error fetching antonyms"];
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getWordData" && request.word) {
    (async () => {
      const synonyms = await fetchSynonyms(request.word);
      const antonyms = await fetchAntonyms(request.word);
      sendResponse({ synonyms, antonyms });
    })();
    return true; // Keep message channel open for async response
  }
});
