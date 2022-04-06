import "./messenger.css";
import TopBar from "../../components/topbar/Topbar";
import { Conversations } from "../../components/conversations/Conversations";
import { Message } from "../../components/message/Message";
import { ChatOnline } from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { apiUrl } from "../../shared";
import io from "socket.io-client";

export const MessengerPage = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current?.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current?.emit("addUser", user._id);
    socket.current?.on("getUsers", (users) => {
      setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`${apiUrl}conversations/${user._id}`);
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get(`${apiUrl}messages/${currentChat?._id}`);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const message = {
      text: newMessage,
      sender: user._id,
      conversationId: currentChat?._id,
    };

    const receiverId = currentChat.members.find((member) => member !== user._id);

    socket.current?.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(`${apiUrl}messages`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <TopBar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chat-menu__wrapper">
            <input placeholder="Search for friends" className="chat-menu__input" />
            {conversations.map((conversation) => (
              <div onClick={() => setCurrentChat(conversation)}>
                <Conversations conversation={conversation} key={conversation._id} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chat-box__wrapper">
            {currentChat ? (
              <>
                <div className="chat-box__top">
                  {messages.map((message) => (
                    <div ref={scrollRef}>
                      <Message message={message} key={message._id} own={message.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chat-box__bottom">
                  <textarea
                    placeholder="Write something..."
                    className="chat-message__input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                  <button type="submit" className="chat-submit__button" onClick={sendMessageHandler}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversation">Open a conversation to start a chat.</span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chat-online__wrapper">
            <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
          </div>
        </div>
      </div>
    </>
  );
};
