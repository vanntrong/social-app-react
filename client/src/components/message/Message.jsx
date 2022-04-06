import "./message.css";
import { format } from "timeago.js";

export const Message = ({ message, own }) => {
  return (
    <div className={`message ${own ? "own" : ""}`}>
      <div className="message-top">
        <img
          src="https://images.unsplash.com/photo-1644982647711-9129d2ed7ceb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
          alt=""
          className="message-img"
        />
        <p className="message-text">{message.text}</p>
      </div>
      <div className="message-bottom">{format(message.createdAt)}</div>
    </div>
  );
};
