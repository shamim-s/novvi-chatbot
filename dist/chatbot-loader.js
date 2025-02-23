(function () {
  if (!document.getElementById("novvi-chatbot")) {
    const div = document.createElement("div");
    div.id = "novvi-chatbot";
    document.body.appendChild(div);
  }
  const reactScript = document.createElement("script");
  reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
  document.head.appendChild(reactScript);
  const reactDomScript = document.createElement("script");
  reactDomScript.src =
    "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
  document.head.appendChild(reactDomScript);
  const chatbotScript = document.createElement("script");
  chatbotScript.src =
    "https://your-vercel-site.vercel.app/assets/index-Buuc5GvV.js"; // Placeholder
  chatbotScript.onload = () => window.loadNovviChatbot("novvi-chatbot");
  document.head.appendChild(chatbotScript);
  const cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.href =
    "https://your-vercel-site.vercel.app/assets/index-Dgn0X3L9.css"; // Placeholder
  document.head.appendChild(cssLink);
})();
