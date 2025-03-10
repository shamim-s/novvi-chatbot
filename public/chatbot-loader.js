(function () {
  const script = document.createElement("script");
  script.src = "https://your-domain.com/chatbot.js";
  script.async = true;
  document.body.appendChild(script);

  window.initNovviChatbot = function (config) {
    if (window.NovviChatbot) {
      window.NovviChatbot.init(config);
    } else {
      script.onload = function () {
        window.NovviChatbot.init(config);
      };
    }
  };
})();
