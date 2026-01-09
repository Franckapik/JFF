import { createRoot } from "react-dom/client";

import AppRouter from "./AppRouter.tsx";
import { setupLogForwarder } from "./logger/logForwarder.ts";
import "./styles/App.css";

// ✅ Forward console logs to terminal in dev mode (centralized setup)
setupLogForwarder(`browser:${window.location.pathname}`, import.meta.env.DEV);

// Les versions App et SimpleApp ont été fusionnées en une seule version
const root = createRoot(document.getElementById("root"));
root.render(<AppRouter />);
