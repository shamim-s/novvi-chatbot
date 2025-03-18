class NovviChatbotWidget {
  constructor() {
    this.initialized = false;
  }

  init(config = {}) {
    if (this.initialized) return;

    // Create container div
    const container = document.createElement("div");
    container.id = "novvi-chatbot-root";
    document.body.appendChild(container);

    // Load React and our Chatbot component
    import("./Chatbot").then(({ default: Chatbot }) => {
      const { createRoot } = require("react-dom/client");
      const root = createRoot(container);
      root.render(React.createElement(Chatbot, { config }));
    });

    this.initialized = true;
  }
}

// Create global instance
window.NovviChatbot = new NovviChatbotWidget();

// Auto-initialize if widget ID is present
const currentScript = document.currentScript;
if (currentScript) {
  const widgetId = currentScript.getAttribute("data-widget-id");
  if (widgetId) {
    window.NovviChatbot.init({ widgetId });
  }
}
