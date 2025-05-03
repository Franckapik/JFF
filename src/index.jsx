import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import SimpleApp from "./SimpleApp";
import "./styles.css";

// Pour basculer entre l'application complète et la version éducative simplifiée,
// changez cette variable à true pour utiliser SimpleApp
const USE_SIMPLE_APP = true;

const root = createRoot(document.getElementById("root"));
root.render(USE_SIMPLE_APP ? <SimpleApp /> : <App />);
