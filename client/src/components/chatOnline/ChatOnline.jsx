import axios from "axios";
import { useState, useEffect } from "react";
import { apiUrl } from "../../shared";
import "./chatOnline.css";

export const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentId);
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  return (
    <div className="chatOnline">
      {onlineFriends.map((friend) => (
        <div className="chatOnline-friend">
          <div className="chatOnline-img__container">
            <img
              src={friend?.profilePicture ? friend.profilePicture : publicFolder + "person/noAvatar.png"}
              alt=""
              className="chatOnline-img"
            />
            <div className="chatOnline-badge"></div>
          </div>
          <span className="chatOnline-name">{friend?.username}</span>
        </div>
      ))}
    </div>
  );
};
