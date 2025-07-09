import { useState } from "react";

import usePlayerStore from "../../stores/usePlayerStore"; // Import player store

import MessageModal from "./MessageModal";

const MessageSelector = ({ playerId = "player-1" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const playerMessages = usePlayerStore((state) => state.players[playerId]?.messages || []); // Get messages for the player
  const markMessagesAsRead = usePlayerStore((state) => state.markMessagesAsRead); // Get the function to mark messages as read

  // Calculate the number of unread messages
  const unreadCount = playerMessages.filter((message) => !message.isRead).length;

  const handleViewMessages = () => {
    setIsModalOpen(true);
    markMessagesAsRead(playerId); // Mark all messages as read when the modal is opened
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
