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

// Create tooltip popup
function showPopup(word, synonyms, antonyms, rect) {
  const popup = document.createElement("div");
  popup.innerHTML = `
    <b>Synonyms:</b> ${synonyms.join(", ")}<br>
    <b>Antonyms:</b> ${antonyms.join(", ")}
  `;
  Object.assign(popup.style, {
    position: "absolute",
    background: "#ffffff",
    color: "#000",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    padding: "10px",
    fontFamily: "Segoe UI, sans-serif",
    fontSize: "13px",
    maxWidth: "280px",
    zIndex: 999999,
  });

  // Position near selected text
  popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(popup);
  
  const removePopup = (event) => {
    if (!popup.contains(event.target)) {
      popup.remove();
      document.removeEventListener("mousedown", removePopup);
    }
  };

  document.addEventListener("mousedown", removePopup);
}

// Listen for user selecting a word
document.addEventListener("mouseup", async () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText && selectedText.split(" ").length === 1) {
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const [synonyms, antonyms] = await Promise.all([
      fetchSynonyms(selectedText),
      fetchAntonyms(selectedText)
    ]);

    showPopup(selectedText, synonyms, antonyms, rect);
  }
});
