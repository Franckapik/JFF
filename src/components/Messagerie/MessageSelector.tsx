import React, { useState } from "react";

import usePlayerStore from "../../stores/usePlayerStore";

import MessageModal from "./MessageModal";

interface MessageSelectorProps {
  playerId?: string;
}

const MessageSelector: React.FC<MessageSelectorProps> = ({ playerId = "player-1" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const playerMessages = usePlayerStore((state) => state.players[playerId]?.messages || []);
  const markMessagesAsRead = usePlayerStore((state) => state.markMessagesAsRead);

  // Calculate the number of unread messages
  const unreadCount = playerMessages.filter((message) => !message.isRead).length;

  const handleViewMessages = () => {
    setIsModalOpen(true);
    markMessagesAsRead(playerId);
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
