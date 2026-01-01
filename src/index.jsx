import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./styles/App.css";

// Forward console logs to terminal in dev mode
if (import.meta.env.DEV) {
  const original = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  const send = (level, args) => {
    // Serialize args safely (handle circular refs, complex objects)
    const serializedArgs = args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
      } catch (e) {
        return String(arg);
      }
    });

    fetch("http://localhost:5123/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        args: serializedArgs,
        meta: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => {}); // Silently fail if log server is down
  };

  console.log = (...args) => { original.log(...args); send("log", args); };
  console.warn = (...args) => { original.warn(...args); send("warn", args); };
  console.error = (...args) => { original.error(...args); send("error", args); };
}

// Les versions App et SimpleApp ont été fusionnées en une seule version
const root = createRoot(document.getElementById("root"));
root.render(<App />);
