import { useEffect, useState } from "react";
import { apiUrl } from "../../shared";
import axios from "axios";
import "./conversations.css";

export const Conversations = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    const friendId = conversation.members.find((member) => member !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}users?userId=${friendId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  return (
    <div className="conversations">
      <img
        src={user?.profilePicture ? user?.profilePicture : publicFolder + "/person/noAvatar.png"}
        className="conversation-img"
      />
      <span className="conversation-name">{user?.username}</span>
    </div>
  );
};
