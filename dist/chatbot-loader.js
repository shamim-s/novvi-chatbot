(function () {
  // Create container if not present
  if (!document.getElementById("novvi-chatbot")) {
    const div = document.createElement("div");
    div.id = "novvi-chatbot";
    document.body.appendChild(div);
  }

  // Load React
  const reactScript = document.createElement("script");
  reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
  document.head.appendChild(reactScript);

  // Load ReactDOM
  const reactDomScript = document.createElement("script");
  reactDomScript.src =
    "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
  document.head.appendChild(reactDomScript);

  // Load Chatbot JS
  const chatbotScript = document.createElement("script");
  chatbotScript.src =
    "https://raw.githubusercontent.com/shamim-s/novvi-chatbot/main/dist/assets/index-Buuc5GvV.js"; // Raw GitHub URL
  chatbotScript.onload = () => window.loadNovviChatbot("novvi-chatbot");
  document.head.appendChild(chatbotScript);

  // Load CSS
  const cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.href =
    "https://raw.githubusercontent.com/shamim-s/novvi-chatbot/main/dist/assets/index-Dgn0X3L9.css"; // Raw GitHub URL
  document.head.appendChild(cssLink);
})();
