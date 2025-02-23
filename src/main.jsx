import ReactDOM from "react-dom/client";
import Chatbot from "./Chatbot";
import "./index.css";

window.loadNovviChatbot = (containerId) => {
  const container = document.getElementById(containerId);
  if (container) {
    ReactDOM.createRoot(container).render(<Chatbot />);
  } else {
    console.error(`Container with ID "${containerId}" not found.`);
  }
};
