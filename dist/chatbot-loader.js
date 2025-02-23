(function () {
  console.log("Loader started");
  if (!document.getElementById("novvi-chatbot")) {
    const div = document.createElement("div");
    div.id = "novvi-chatbot";
    document.body.appendChild(div);
    console.log("Container created");
  }

  const reactScript = document.createElement("script");
  reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
  reactScript.onload = () => console.log("React loaded");
  reactScript.onerror = () => console.error("React failed to load");
  document.head.appendChild(reactScript);

  const reactDomScript = document.createElement("script");
  reactDomScript.src =
    "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
  reactDomScript.onload = () => console.log("ReactDOM loaded");
  reactDomScript.onerror = () => console.error("ReactDOM failed to load");
  document.head.appendChild(reactDomScript);

  const chatbotScript = document.createElement("script");
  chatbotScript.src =
    "https://raw.githubusercontent.com/shamim-s/novvi-chatbot/main/dist/assets/index-Buuc5GvV.js";
  chatbotScript.onload = () => {
    console.log("Chatbot JS loaded");
    if (window.loadNovviChatbot) {
      window.loadNovviChatbot("novvi-chatbot");
      console.log("loadNovviChatbot called");
    } else {
      console.error("loadNovviChatbot not defined");
    }
  };
  chatbotScript.onerror = () => console.error("Chatbot JS failed to load");
  document.head.appendChild(chatbotScript);

  const cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.href =
    "https://raw.githubusercontent.com/shamim-s/novvi-chatbot/main/dist/assets/index-Dgn0X3L9.css";
  cssLink.onload = () => console.log("CSS loaded");
  cssLink.onerror = () => console.error("CSS failed to load");
  document.head.appendChild(cssLink);
})();
