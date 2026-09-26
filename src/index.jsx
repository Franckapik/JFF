import { createRoot } from "react-dom/client";

import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import AppRouter from "./AppRouter.tsx";
import { setupLogForwarder } from "./logger/logForwarder.ts";
import "./styles/session.css";

setupLogForwarder(`browser:${window.location.pathname}`, import.meta.env.DEV && import.meta.env.VITE_FORWARD_LOGS === 'true');

const container = document.getElementById("root");
if (!container) throw new Error("Missing application root");
const root = createRoot(container);
root.render(<AppRouter />);
