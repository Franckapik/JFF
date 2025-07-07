import { useState } from "react";
import ReactDOM from "react-dom";
import { useTileStore } from "../../stores/useTileStore/index.ts"; // Import Zustand store
import "../../styles/App.css"; // Import CSS for modal styling

const MessageModal = ({ messages, onClose }) => {
  const [selectedMessage, setSelectedMessage] = useState(null); // Track the selected message
  const markMessageAsRead = useTileStore((state) => state.markMessageAsRead); // Import markMessageAsRead from the store

  const handleSelectMessage = (message, index) => {
    setSelectedMessage(message);
    markMessageAsRead(index); // Mark the message as read
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Convert timestamp to a human-readable format
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
            <p><em>Reçu le : {formatTimestamp(selectedMessage.timestamp)}</em></p>
            <button className="close-button" onClick={() => setSelectedMessage(null)}>
              Retour
            </button>
          </div>
        ) : (
          <ul className="message-list">
            {sortedMessages.length > 0 ? (
              sortedMessages.map((message, index) => (
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
                  <div className="message-timestamp message-timestamp-text">
                    <em>Reçu le : {formatTimestamp(message.timestamp)}</em>
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
