import React from "react";
import ReactDOM from "react-dom";
import "../styles/App.css"; // Import CSS for modal styling

const MessageModal = ({ messages, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Messages Reçus</h2>
        <ul className="message-list">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <li key={index} className="message-item">
                <strong>Drone {message.droneId}:</strong> {message.text}
              </li>
            ))
          ) : (
            <li>Aucun message reçu</li>
          )}
        </ul>
        <button className="close-button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>,
    document.body // Render the modal directly into the <body> element
  );
};

export default MessageModal;
