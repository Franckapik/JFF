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
    <div className="message-selector">
      <ul>
        <li>
          <button onClick={handleViewMessages}>
            Messagerie
            {unreadCount > 0 && <span>{unreadCount}</span>}
          </button>
        </li>
      </ul>
      {isModalOpen && <MessageModal messages={playerMessages} onClose={handleCloseModal} />}
    </div>
  );
};

export default MessageSelector;
