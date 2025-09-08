import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { clearUser } from "../features/currentUserSlice";
import { useNavigate } from "react-router-dom";
import PlasmaBackground from "./PlasmaBackground";
import { FiLogOut, FiSmile } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeouts = useRef({});

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    socketRef.current = io(API_URL, {
      withCredentials: true,
      auth: { token: user?.token || null },
    });
    const socket = socketRef.current;

    socket.on("connect", () => console.log("Socket connected:", socket.id));

    socket.on("chat history", (history) => {
      const uniqueHistory = history.filter(
        (msg, index, self) => index === self.findIndex((m) => m._id === msg._id)
      );
      setMessages(uniqueHistory);
    });

    socket.on("chat message", (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("typing", ({ userId, name }) => {
      setTypingUsers((prev) => (prev.includes(name) ? prev : [...prev, name]));
      if (typingTimeouts.current[name]) clearTimeout(typingTimeouts.current[name]);
      typingTimeouts.current[name] = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((n) => n !== name));
      }, 2000);
    });

    socket.on("connect_error", (err) => console.error("Socket error:", err));

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [user]);

  useEffect(() => scrollToBottom(), [messages, typingUsers, scrollToBottom]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msgObj = {
      id: uuidv4(),
      sender: user.id,
      senderName: user.name,
      content: text,
      timestamp: new Date().toISOString(),
    };
    socketRef.current.emit("chat message", msgObj);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
    else {
      socketRef.current.emit("typing", {
        userId: user?.id || "anon",
        name: user?.name || "Anonymous",
      });
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex justify-center items-center h-screen text-gray-200 relative">
      <PlasmaBackground />
      <div className="flex flex-col w-full max-w-md h-[100vh] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 flex justify-between items-center bg-gradient-to-r from-gray-900 to-blue-600 text-white shadow-md">
          <span className="font-semibold text-lg tracking-wide">{user?.name || "Anonymous"}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 transition-colors text-white text-sm px-3 py-1 rounded-lg shadow-sm"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 relative scrollbar-hide">
          {messages.length === 0 && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center text-gray-400 text-sm max-w-[80%] opacity-70">
              Start conversation by typing a message...
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg._id || msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-[75%] px-4 py-2 rounded-xl text-sm break-words ${
                msg.sender === (user?.id || "anon")
                  ? "self-end bg-blue-500 text-white rounded-br-sm"
                  : msg.sender === "astro"
                  ? "self-start bg-purple-700 text-white rounded-bl-sm"
                  : "self-start bg-gray-700 text-gray-200 rounded-bl-sm"
              }`}
            >
              {msg.senderName && <span className="font-semibold">{msg.senderName}: </span>}
              {msg.content}
              <div className="text-[10px] text-gray-400 text-right mt-1">
                {dayjs(msg.timestamp).format("HH:mm")}
              </div>
            </motion.div>
          ))}

          {typingUsers.length > 0 && (
            <div className="text-sm text-gray-400 italic">{typingUsers.join(", ")} typing...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center border-t border-gray-700 bg-gray-800 p-2 gap-2 relative">
          <button
            onClick={() => setShowEmoji((prev) => !prev)}
            className="text-xl text-yellow-400 hover:text-yellow-300"
          >
            <FiSmile />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-3 bg-gray-700 outline-none text-white placeholder-gray-400 rounded-lg"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 px-5 text-white font-bold hover:bg-blue-600 transition-colors rounded-lg"
          >
            Send
          </button>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-12 left-2 z-50"
              >
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  theme="dark"
                  width={300}
                  height={350}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Chat;
