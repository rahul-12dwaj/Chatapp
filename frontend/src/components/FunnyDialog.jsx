// FunnyDialog.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const FunnyDialog = ({ theme = "light", onClose }) => {
  const [typedText, setTypedText] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const audioRef = useRef(null);
  const message = `I wish tumhare sapne pure ho jaayein 🤍🍁!!`;

  // Theme styles
  const themes = {
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      audioBg: "bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300",
      audioText: "text-gray-900",
      typingText: "text-gray-800",
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-gray-100",
      audioBg: "bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700",
      audioText: "text-white",
      typingText: "text-white",
    },
  };
  const t = themes[theme];

  // Auto-play audio + start celebration + typing on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) =>
        console.log("Autoplay blocked:", e)
      );
    }
    setShowCelebration(true);

    let index = 0;
    const interval = setInterval(() => {
      setTypedText(message.slice(0, index + 1));
      index++;
      if (index === message.length) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const emojis = ["❤️"];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className={`relative rounded-2xl shadow-2xl p-6 w-80 text-center ${t.bg} ${t.text}`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Celebration emojis */}
          <AnimatePresence>
            {showCelebration &&
              [...Array(15)].map((_, i) => {
                const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ y: -150, opacity: 0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute text-3xl pointer-events-none select-none"
                  >
                    {emoji}
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {/* Audio player */}
          <div
            className={`mt-4 p-1 rounded-4xl shadow-lg flex flex-col justify-center items-center ${t.audioBg}`}
          >
            <audio
              ref={audioRef}
              src="/Finding Her (Jana Mere Sawalon Ka Manzar Tu)  Kushagra  Vanshika  Bharath  Karan Maini UR Debut - 128-1.mp3"
              controls
              className={`w-full rounded-lg ${t.audioText}`}
            />
          </div>

          {/* Simple typing text */}
          <p className={`mt-3 text-sm ${t.typingText} text-center whitespace-pre-wrap`}>
            {typedText}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FunnyDialog;
