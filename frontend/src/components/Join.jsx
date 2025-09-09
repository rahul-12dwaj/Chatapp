import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setUser } from "../features/currentUserSlice";
import PlasmaBackground from "./PlasmaBackground";

const Join = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔥 Auto login toggle
  const [autoLoginMode, setAutoLoginMode] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // -------------------------------
  // Toast Auto-Hide
  // -------------------------------
  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => setToast({ message: "", type: "" }), 4000);
    return () => clearTimeout(timer);
  }, [toast]);



  // get device information

  const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    // screen size
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    // browser viewport
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    // timestamp
    loginTime: new Date().toISOString(),
  };
};


  // -------------------------------
  // Submit Handler
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 If auto mode is on → bypass validation
    const loginEmail = autoLoginMode ? "defaultuser@example.com" : email;
    const loginPassword = autoLoginMode ? "1@1BharD" : password;

    if (!autoLoginMode) {
      if (!loginEmail) return setEmailError("Email is required");
      if (!loginPassword) return setPasswordError("Password is required");
    }

    const deviceInfo = getDeviceInfo();

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, deviceInfo}),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Login API Response:", data);

      if (!res.ok) {
        return setToast({ message: data.message || "Invalid credentials", type: "error" });
      }

      // Success: update Redux
      dispatch(setUser({
        id: data.user.id,
        name: data.user.name,
        username: data.user.username,
        email: data.user.email,
        avatar: data.user.avatar,
        token: data.user.token,
      }));

      // Save token in localStorage
      localStorage.setItem("token", data.user.token);

      setToast({ message: "Login Successful!", type: "success" });

      // Navigate to dashboard
      setTimeout(() => navigate("/dashboard"), 200);

    } catch (err) {
      console.error("Network Error:", err);
      setToast({ message: "Network Error", type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4 z-50 overflow-auto hide-scrollbar">
      <PlasmaBackground />

      {/* Back Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white text-sm hover:text-cyan-300 transition"
      >
        <FiArrowLeft className="text-lg" /> Back
      </Link>

      {/* Toggle Auto/Manual */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <label className="text-white text-sm">Auto Login</label>
        <input
          type="checkbox"
          checked={autoLoginMode}
          onChange={() => setAutoLoginMode(!autoLoginMode)}
          className="w-5 h-5"
        />
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl shadow-lg px-6 py-8 flex flex-col gap-5"
      >
        <div className="flex flex-col items-center text-center gap-2">
          <p className="text-xl font-bold text-white">
            {autoLoginMode ? "Auto Login Mode" : "Login to your Account :)"}
          </p>
          <span className="text-sm text-gray-400 max-w-xs">
            {autoLoginMode
              ? "Click Sign In to enter demo mode instantly."
              : "Enter your email and password to continue."}
          </span>
        </div>

        {/* Only show fields if Manual login */}
        {!autoLoginMode && (
          <>
            {/* Email Field */}
            <div className="flex flex-col gap-1 text-white">
              <label htmlFor="email_field" className="text-xs font-semibold text-gray-400">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
                <input
                  type="email"
                  id="email_field"
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full h-11 pl-10 pr-3 rounded-md border bg-black/20 text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1 text-white">
              <label htmlFor="password_field" className="text-xs font-semibold text-gray-400">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
                <input
                  type="password"
                  id="password_field"
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-11 pl-10 pr-3 rounded-md border bg-black/20 text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-11 flex items-center justify-center rounded-md font-semibold transition bg-blue-600 hover:bg-blue-400 text-white"
        >
          {autoLoginMode ? "Let's Chat 🚀" : "Sign In"}
        </button>
      </form>

      {/* Toast */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, duration: 0.5 }}
            className={`fixed right-6 bottom-15 px-5 py-3 rounded-lg shadow-lg text-white font-semibold ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Join;
