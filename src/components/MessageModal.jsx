import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import "../styles/App.css"; // Import CSS for modal styling

const MessageModal = ({ messages, onClose }) => {
  const [selectedMessage, setSelectedMessage] = useState(null); // Track the selected message
  const markMessageAsRead = useTileStore((state) => state.markMessageAsRead); // Import markMessageAsRead from the store

  const handleSelectMessage = (message, index) => {
    setSelectedMessage(message);
    markMessageAsRead(index); // Mark the message as read
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Messages Reçus</h2>
        {selectedMessage ? (
          <div>
            <h3>Détails du Message</h3>
            <p><strong>Drone {selectedMessage.droneId}:</strong></p>
            <p>{selectedMessage.body}</p>
            <button className="close-button" onClick={() => setSelectedMessage(null)}>
              Retour
            </button>
          </div>
        ) : (
          <ul className="message-list">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <li
                  key={index}
                  className={`message-item ${message.isRead ? "read" : "unread"}`} // Apply different styles
                  onClick={() => handleSelectMessage(message, index)} // Set the selected message
                >
                  <div className="message-header">
                    <span className="message-index">{index + 1}.</span>
                    <span className="message-title">
                      <strong>Drone {message.droneId}:</strong> {message.title}
                    </span>
                  </div>
                  <div className="message-tile">
                    <em>Tuile : {message.tileName}</em>
                  </div>
                </li>
              ))
            ) : (
              <li>Aucun message reçu</li>
            )}
          </ul>
        )}
        <button className="close-button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>,
    document.body // Render the modal directly into the <body> element
  );
};

export default MessageModal;
