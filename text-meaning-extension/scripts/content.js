// Create tooltip popup
function showPopup(word, synonyms, antonyms, rect) {
  // Remove existing popup
  const existing = document.querySelector(".word-tooltip");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.className = "word-tooltip";
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

  // Remove tooltip on click outside
  const removeOnClick = (event) => {
    if (!popup.contains(event.target)) {
      popup.remove();
      document.removeEventListener("mousedown", removeOnClick);
    }
  };
  document.addEventListener("mousedown", removeOnClick);
}

// Listen for user selecting a word
document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (!selectedText || selectedText.split(" ").length > 1) return;

  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Send message to background script to fetch synonyms & antonyms
  chrome.runtime.sendMessage(
    { action: "getWordData", word: selectedText },
    (response) => {
      if (response) {
        showPopup(selectedText, response.synonyms, response.antonyms, rect);
      }
    }
  );
});
