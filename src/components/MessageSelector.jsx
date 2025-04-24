import React, { useState } from "react";
import MessageModal from "./MessageModal";

const MessageSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const messages = [
    { droneId: 1, text: "Mission accomplie sur la tuile A3." },
    { droneId: 2, text: "Obstacle détecté sur la route vers B4." },
    { droneId: 3, text: "Ressources collectées sur la tuile C2." },
  ];

  const handleViewMessages = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      {isModalOpen && <MessageModal messages={messages} onClose={handleCloseModal} />}
    </div>
  );
};

export default MessageSelector;
