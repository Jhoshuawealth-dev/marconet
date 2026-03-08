import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Restore theme preference before render to avoid flash
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
