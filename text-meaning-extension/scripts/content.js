document.addEventListener("mouseup", async () => {
  const selectedText = window.getSelection().toString().trim();
  if (!selectedText) return;

  // Remove old popups
  const oldPopup = document.getElementById("dictionary-popup");
  if (oldPopup) oldPopup.remove();

  // Connect with background.js
  chrome.runtime.sendMessage(
    { action: "fetchWordData", word: selectedText },
    (response) => {
      if (!response || response.error) {
        console.error("No response or error:", response?.error);
        return;
      }

      const { meaning, synonyms, antonyms } = response;

      // Create popup
      const popup = document.createElement("div");
      popup.id = "dictionary-popup";
      Object.assign(popup.style, {
        position: "absolute",
        backgroundColor: "#ffffff",
        color: "#222",
        padding: "14px 16px",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.08)",
        maxWidth: "340px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        zIndex: "999999",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "14px",
        lineHeight: "1.5",
        backdropFilter: "blur(8px)",
        transition: "opacity 0.2s ease-in-out",
        opacity: "0",
      });
      setTimeout(() => (popup.style.opacity = "1"), 50);

      // Popup layout
      popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-weight: 600; font-size: 15px;">${capitalizeFirstLetter(selectedText)}</span>
        </div>
        <div style="margin-top: 4px;">
          <div><b>Meaning:</b> <span style="color:#333;">${meaning}</span></div>
          <div style="margin-top: 4px;"><b>Synonyms:</b> <span style="color:#555;">${synonyms.join(", ") || "None"}</span></div>
          <div style="margin-top: 4px;"><b>Antonyms:</b> <span style="color:#555;">${antonyms.join(", ") || "None"}</span></div>
        </div>
      `;

      document.body.appendChild(popup);

      // Position near selection
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      popup.style.top = `${window.scrollY + rect.bottom + 10}px`;
      popup.style.left = `${window.scrollX + rect.left}px`;

      // Close bug
      const closePopup = (e) => {
        if (!popup.contains(e.target)) {
          popup.remove();
          document.removeEventListener("click", closePopup);
        }
      };
      setTimeout(() => document.addEventListener("click", closePopup), 100);
    }
  );

  function capitalizeFirstLetter(str) {
  if (str.length === 0) {
    return ""; // Handle empty string case
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
});
