import React, { useState } from "react";
import ReactDOM from "react-dom";

import usePlayerStore from "../../stores/usePlayerStore";
import "../../styles/App.css";

import type { PlayerMessage } from "../../types/stores.d";

interface MessageModalProps {
  messages: PlayerMessage[];
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ messages, onClose }) => {
  const [selectedMessage, setSelectedMessage] = useState<PlayerMessage | null>(null);
  const markMessageAsRead = usePlayerStore((state) => state.markMessageAsRead);

  const handleSelectMessage = (message: PlayerMessage, index: number) => {
    setSelectedMessage(message);
    markMessageAsRead(index);
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Trier les messages par timestamp décroissant
  const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp);

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Messages Reçus</h2>
        {selectedMessage ? (
          <div>
            <h3>Détails du Message</h3>
            <p><strong>Drone {selectedMessage.droneId}:</strong></p>
            <p>{selectedMessage.text?.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            )) || "Message vide"}</p>
            <table className="message-table">
              <thead>
                <tr>
                  <th>Ressource</th>
                  <th>Quantité</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nourriture</td>
                  <td>{selectedMessage.resources?.food || 0}</td>
                </tr>
                <tr>
                  <td>Débris</td>
                  <td>{selectedMessage.resources?.debris || 0}</td>
                </tr>
                <tr>
                  <td>Spécial</td>
                  <td>{selectedMessage.resources?.special || 0}</td>
                </tr>
              </tbody>
            </table>
            <p><strong>Horodatage:</strong> {formatTimestamp(selectedMessage.timestamp)}</p>
            <p><strong>Tuile:</strong> {selectedMessage.tileName}</p>
            <button onClick={() => setSelectedMessage(null)}>Retour à la liste</button>
          </div>
        ) : (
          <div>
            <div className="message-list">
              {sortedMessages.length === 0 ? (
                <p>Aucun message reçu</p>
              ) : (
                sortedMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`message-item ${!message.isRead ? "unread" : ""}`}
                    onClick={() => handleSelectMessage(message, index)}
                  >
                    <p><strong>{message.title}</strong> - {message.tileName}</p>
                    <p>{formatTimestamp(message.timestamp)}</p>
                  </div>
                ))
              )}
            </div>
            <button onClick={onClose}>Fermer</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default MessageModal;
