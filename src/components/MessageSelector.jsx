import React, { useState } from "react";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import MessageModal from "./MessageModal";

const MessageSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const playerMessages = useTileStore((state) => state.playerMessages); // Get messages from the store

  // Calculate the number of unread messages
  const unreadCount = playerMessages.filter((message) => !message.isRead).length;

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
            style={{
              marginBottom: "10px",
              padding: "10px",
              cursor: "pointer",
              position: "relative",
            }}
          >
            Messagerie
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </li>
      </ul>
      {isModalOpen && <MessageModal messages={playerMessages} onClose={handleCloseModal} />}
    </div>
  );
};

export default MessageSelector;
