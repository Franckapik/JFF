import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// Les versions App et SimpleApp ont été fusionnées en une seule version
const root = createRoot(document.getElementById("root"));
root.render(<App />);
