import React from "react";

const MessageSelector = () => {
  const handleViewMessages = () => {
    alert("Voici les messages envoyés par les drones !");
  };

  return (
    <div className="message-selector" style={{ position: "absolute", left: 10, top: 120, zIndex: 10 }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <button
            onClick={handleViewMessages}
            style={{ marginBottom: "10px", padding: "10px", cursor: "pointer" }}
          >
            Messagerie
          </button>
        </li>
      </ul>
    </div>
  );
};

export default MessageSelector;
