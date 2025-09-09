import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { clearUser } from "../features/currentUserSlice";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiSmile, FiMoon, FiSun } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

// ✅ Import your FunnyDialog component
import FunnyDialog from "./FunnyDialog";

const Chat = () => {
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showDialog, setShowDialog] = useState(false); // ✅ state for dialog

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeouts = useRef({});
  const emojiRef = useRef(null);

  // Auto scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Prevent refresh / closing
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Setup socket
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
    localStorage.removeItem("user");
    dispatch(clearUser());
    navigate("/login");
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  // Theme styles
  const themes = {
    light: {
      container: "bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 text-gray-800",
      header: "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
      messages: "bg-white/70",
      inputBar: "bg-gradient-to-r from-pink-100 to-purple-100",
      bubbleSelf: "bg-gradient-to-r from-pink-500 to-red-400 text-white",
      bubbleOther: "bg-gradient-to-r from-blue-400 to-cyan-400 text-white",
      bubbleAstro: "bg-gradient-to-r from-purple-500 to-indigo-400 text-white",
    },
    dark: {
      container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100",
      header: "bg-gradient-to-r from-gray-800 to-gray-700 text-white",
      messages: "bg-gray-900/70",
      inputBar: "bg-gradient-to-r from-gray-800 to-gray-700",
      bubbleSelf: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
      bubbleOther: "bg-gradient-to-r from-gray-700 to-gray-600 text-white",
      bubbleAstro: "bg-gradient-to-r from-purple-700 to-pink-700 text-white",
    },
  };

  const t = themes[theme];

  // click outside for emoji picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  return (
    <div className={`flex justify-center items-center h-screen relative ${t.container}`}>
      <div className="flex flex-col w-full h-full shadow-2xl overflow-hidden backdrop-blur-lg">
        {/* Header */}
        <div className={`p-4 flex justify-between items-center shadow-lg ${t.header}`}>
          <span
            onClick={() => setShowDialog(true)} // ✅ Open FunnyDialog on avatar click
            className="font-bold text-xl tracking-wide drop-shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-white shadow-md"
            />
          </span>

          <div className="flex items-center gap-3 relative">
            {/* Theme Toggle Icon */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-full shadow-md transition-colors ${
                theme === "light"
                  ? "bg-yellow-400 text-white hover:bg-yellow-500"
                  : "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "light" ? (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiMoon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiSun className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 transition-colors text-white text-sm px-3 py-1 rounded-lg shadow-md"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* ✅ FunnyDialog appears here */}
        <AnimatePresence>
        {showDialog && (
          <FunnyDialog
            theme={theme}          // Pass the current theme
            onClose={() => setShowDialog(false)}
          />
        )}
      </AnimatePresence>


        {/* Messages */}
        <div className={`flex-1 p-4 overflow-y-auto flex flex-col gap-4 relative scrollbar-hide ${t.messages}`}>
          {messages.length === 0 && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center text-gray-500 text-sm max-w-[80%] opacity-80">
              Send a message and let the story begin...
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg._id || msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm break-words shadow-md relative ${
                msg.sender === (user?.id || "anon")
                  ? `self-end ${t.bubbleSelf} rounded-br-sm`
                  : msg.sender === "astro"
                  ? `self-start ${t.bubbleAstro} rounded-bl-sm`
                  : `self-start ${t.bubbleOther} rounded-bl-sm`
              }`}
            >
              {msg.senderName && (
                <span className="block font-semibold text-xs mb-1 opacity-80">
                  {msg.senderName}
                </span>
              )}
              {msg.content}
              <div className="text-[10px] text-white/70 text-right mt-1">
                {dayjs(msg.timestamp).format("HH:mm")}
              </div>
            </motion.div>
          ))}

          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-pink-600 italic font-medium"
            >
              {typingUsers.join(", ")} typing...
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`flex items-center border-t border-gray-300 p-3 gap-2 relative ${t.inputBar}`}>
          <button
            onClick={() => setShowEmoji((prev) => !prev)}
            className="text-2xl text-pink-500 hover:scale-110 transition-transform"
          >
            <FiSmile />
          </button>
          <input
            type="text"
            placeholder="Write something sweet..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 bg-white/70 outline-none text-gray-700 placeholder-gray-400 rounded-xl shadow-inner"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            className="bg-gradient-to-r from-pink-500 to-red-500 px-5 py-2 text-white font-bold shadow-lg hover:opacity-90 rounded-xl"
          >
            Send
          </motion.button>

          <AnimatePresence>
            {showEmoji && (
              <motion.div
                ref={emojiRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-14 left-2 z-50"
              >
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  theme={theme === "dark" ? "dark" : "light"}
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
