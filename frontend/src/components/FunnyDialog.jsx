// FunnyDialog.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const FunnyDialog = ({ theme = "light", onClose }) => {
  const [noX, setNoX] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [strikeNo, setStrikeNo] = useState(false);
  const [typedText, setTypedText] = useState("");

  const audioRef = useRef(null);

  const message = `Tum bohot pyaari ho, or tumhari rare smile to bohot hi pyaari, or upasan naam achha h but kitty bolne m kitna pyaara h 🤍🌷, I wish tumhare sapne pure ho jaayein!!`;

  // Theme styles
  const themes = {
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      yesBtn: "bg-green-500 hover:bg-green-600",
      noBtn: "bg-red-500 hover:bg-red-600",
      audioBg: "bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300",
      audioText: "text-gray-900",
      typingText: "text-gray-800",
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-gray-100",
      yesBtn: "bg-green-600 hover:bg-green-700",
      noBtn: "bg-red-600 hover:bg-red-700",
      audioBg: "bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700",
      audioText: "text-white",
      typingText: "text-white",
    },
  };

  const t = themes[theme];

  // Move "No" button
  const moveNoButton = () => {
    if (!strikeNo) setNoX((prev) => prev + 80 * direction);
    setDirection((prev) => prev * -1);
  };

  // Handle "Yes" click
  const handleYesClick = () => {
    setShowCelebration(true);
    setShowAudio(true);
    setStrikeNo(true);
    setTypedText(""); // reset typing

    setTimeout(() => setShowCelebration(false), 3000);
  };

  // Auto-play audio
  useEffect(() => {
    if (showAudio && audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Autoplay blocked:", e));
    }
  }, [showAudio]);

  // Simple typing effect
  useEffect(() => {
    if (!showAudio) return;

    let index = 0;
    const interval = setInterval(() => {
      setTypedText(message.slice(0, index + 1));
      index++;
      if (index === message.length) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, [showAudio, message]);

  const emojis = ["💖", "❤️", "🌸", "🌹", "💐", "🥰"];

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

          <p className="text-lg font-semibold mb-6">
            Mere baare mein jaan’na hai to pehle dost banna padega
          </p>

          <div className="flex justify-center gap-6 relative">
            <button
              onClick={handleYesClick}
              className={`text-white px-5 py-2 rounded-xl shadow-md ${t.yesBtn}`}
            >
              Yes
            </button>

            <motion.button
              animate={{ x: noX }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
              onClick={moveNoButton}
              className={`text-white px-5 py-2 rounded-xl shadow-md relative ${
                strikeNo ? "bg-gray-500 hover:bg-gray-500" : t.noBtn
              }`}
            >
              <span
                className={
                  strikeNo
                    ? "line-through decoration-2 decoration-white/80 dark:decoration-black/80"
                    : ""
                }
              >
                No
              </span>
            </motion.button>
          </div>

          {/* Celebration emojis */}
          <AnimatePresence>
            {showCelebration &&
              [...Array(15)].map((_, i) => {
                const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                const randomX = Math.random() * window.innerWidth - window.innerWidth / 2;
                const randomY = -Math.random() * 400 - 100;
                const duration = Math.random() * 1 + 1.5;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    animate={{
                      opacity: 0,
                      x: randomX,
                      y: randomY,
                      scale: Math.random() * 1.5 + 0.5,
                    }}
                    transition={{ duration }}
                    className="absolute text-3xl pointer-events-none select-none"
                    style={{ left: "50%", top: "70%" }}
                  >
                    {emoji}
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {/* Audio player */}
          {showAudio && (
            <div
              className={`mt-4 p-2 rounded-xl shadow-lg flex flex-col justify-center items-center ${t.audioBg}`}
            >
              <audio
                ref={audioRef}
                src="/Finding Her (Jana Mere Sawalon Ka Manzar Tu)  Kushagra  Vanshika  Bharath  Karan Maini UR Debut - 128-1.mp3"
                controls
                className={`w-full rounded-lg ${t.audioText}`}
              />
            </div>
          )}

          {/* Simple typing text */}
          {showAudio && (
            <p className={`mt-3 text-sm ${t.typingText} text-center whitespace-pre-wrap`}>
              {typedText}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FunnyDialog;
