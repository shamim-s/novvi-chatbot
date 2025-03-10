import { createRoot } from "react-dom/client";
import Chatbot from "./Chatbot";
import "./index.css";
import { StrictMode } from "react";

window.Chatbot = Chatbot;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Chatbot />
  </StrictMode>
);
