import React, { useState } from "react";
import "../../styles/App.css";

const CollapsibleHUD = ({ title, children, defaultOpen = false, className = "" }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`collapsible-hud ${className}`}>
      <div 
        className="collapsible-hud-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3>{title}</h3>
        <span className="collapsible-hud-toggle">
          {isOpen ? "▲" : "▼"}
        </span>
      </div>
      {isOpen && (
        <div className="collapsible-hud-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleHUD;