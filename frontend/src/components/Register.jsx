import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";
import PlasmaBackground from "./PlasmaBackground";

const Register = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Validation functions (same as your current ones)
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    const allowedChars = /^[a-zA-Z0-9_-]*$/;
    if (!allowedChars.test(value)) setUsernameError("Only letters, numbers, '_' and '-' allowed");
    else setUsernameError("");
    setUsername(value);
  };

  const validateUsername = () => {
    if (!username) { setUsernameError("Username is required"); return false; }
    if (username.length < 3) { setUsernameError("Username must be at least 3 characters"); return false; }
    setUsernameError(""); return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const allowedChars = /^[a-zA-Z0-9@._-]*$/;
    if (!allowedChars.test(value)) setEmailError("Invalid character detected");
    else setEmailError("");
    setEmail(value);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const atCount = (email.match(/@/g) || []).length;
    if (!email) { setEmailError("Email is required"); return false; }
    if (atCount > 1) { setEmailError("Only one '@' is allowed"); return false; }
    if (!emailRegex.test(email)) { setEmailError("Invalid email format"); return false; }
    setEmailError(""); return true;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 6) setPasswordError("Password must be at least 6 characters");
    else setPasswordError("");
  };

  const validatePassword = () => {
    if (!password) { setPasswordError("Password is required"); return false; }
    if (password.length < 6) { setPasswordError("Password must be at least 6 characters"); return false; }
    setPasswordError(""); return true;
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) setConfirmPasswordError("Passwords do not match");
    else setConfirmPasswordError("");
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) { setConfirmPasswordError("Confirm Password is required"); return false; }
    if (confirmPassword !== password) { setConfirmPasswordError("Passwords do not match"); return false; }
    setConfirmPasswordError(""); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const valid = validateUsername() && validateEmail() && validatePassword() && validateConfirmPassword();
    if (!valid) return;

    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        setToast({ message: "Registration Successful!", type: "success" });
        setTimeout(() => setToast({ message: "", type: "" }), 2000); // clear toast
        setTimeout(() => navigate("/join"), 2000);
      } else {
        setToast({ message: result.message || "Something went wrong", type: "error" });
        setTimeout(() => setToast({ message: "", type: "" }), 2000);
      }


    } catch (err) {
      console.error("Error:", err);
      setServerError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4 backdrop-blur-md z-50 overflow-hidden">
      <PlasmaBackground/>
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white text-sm hover:text-cyan-300 transition"
      >
      <FiArrowLeft className="text-lg" /> Back
      </Link>

      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl shadow-lg px-6 py-8 flex flex-col gap-5 mt-10">
        <div className="flex flex-col items-center text-center gap-2">
          <p className="text-xl font-bold text-white">Register Yourself :)</p>
          <span className="text-sm text-gray-400 max-w-xs">Get started with our app, just create an account and enjoy the experience.</span>
        </div>

        {serverError && <p className="text-red-500 text-center">{serverError}</p>}



        {/* Username */}
        <div className="flex flex-col gap-1 text-white">
          <label htmlFor="email_field" className="text-xs font-semibold text-gray-400">
            Name
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
            <input
              type="text"
              id="name"
              value={username}
              placeholder="Name"
              className={`w-full h-11 pl-10 pr-3 rounded-md border bg-black/20 text-sm focus:ring-2 focus:outline-none`}
            />
          </div>
        </div>


        {/* Username */}
        <div className="flex flex-col gap-1 text-white">
          <label htmlFor="email_field" className="text-xs font-semibold text-gray-400">
            Username
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              onBlur={validateUsername}
              placeholder="Username"
              className={`w-full h-11 pl-10 pr-3 rounded-md border bg-black/20 text-sm focus:ring-2 focus:outline-none ${
                usernameError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
        </div>

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
              onChange={handleEmailChange}
              onBlur={validateEmail}
              placeholder="example@gmail.com"
              className={`w-full h-11 pl-10 pr-3 rounded-md border bg-black/20 text-sm focus:ring-2 focus:outline-none ${
                emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>

        {/* Password + Confirm */}
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-1 text-white">
          <label htmlFor="email_field" className="text-xs font-semibold text-gray-400">
            Password
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
            <input
              type="password"
              id="password_field"
              ref={passwordRef}
              value={password}
              onChange={handlePasswordChange}
              onBlur={validatePassword}
              placeholder="Password"
              className={`w-full h-11 pl-10 pr-3 rounded-md border bg-black/20 text-sm focus:ring-2 focus:outline-none ${
                passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </div>



          <div className="flex flex-col gap-1 text-white">
            <label htmlFor="email_field" className="text-xs font-semibold text-gray-400">
              Password
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
              <input
                type="password"
                id="confirm_password_field"
                ref={confirmPasswordRef}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={validateConfirmPassword}
                placeholder="Confirm Password"
                className={`w-full h-11 pl-10 pr-3 rounded-md border bg-black/20 text-sm focus:ring-2 focus:outline-none ${
                  confirmPasswordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
          </div>
        </div>

        <button type="submit" disabled={loading} className={`w-full h-11 bg-blue-600 hover:bg-blue-400 text-white rounded-md font-semibold transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="text-center mt-3">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <Link
              to="/join"
              className="text-blue-600 font-bold hover:text-blue-400 underline"
            >
            Login!
            </Link>
          </p>
        </div>
        
        <p className="cursor-pointer text-xs text-gray-400 underline text-center mt-3">
          Terms of use & Conditions
        </p>

      </form>

      <AnimatePresence>
        {toast.message && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, duration: 0.5 }}
            className={`fixed right-6 bottom-6 px-5 py-3 rounded-lg shadow-lg text-white font-semibold ${
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

export default Register;
