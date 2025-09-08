import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiAirplay, FiLock } from "react-icons/fi";
import PlasmaBackground from "./PlasmaBackground";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email -> otp -> reset

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your registered email");
      return;
    }
    // TODO: send OTP API call here
    console.log("Sending OTP to:", email);
    setStep("otp");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    // TODO: verify OTP API call here
    console.log("Verifying OTP:", otp);
    setStep("reset");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // TODO: change password API call here
    console.log("Password changed successfully");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 bg-black/40 backdrop-blur-md z-50 z-50 overflow-auto">
      <PlasmaBackground />
      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white text-sm hover:text-cyan-300 transition"
      >
        <FiArrowLeft className="text-lg" />
        Back
      </Link>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <p className="text-2xl font-bold text-white">Forgot Password</p>
          <span className="text-sm text-gray-300">
            {step === "email" &&
              "Enter your registered email to receive an OTP."}
            {step === "otp" && "Enter the OTP sent to your email."}
            {step === "reset" && "Set your new password below."}
          </span>
        </div>

        {/* Step 1: Enter Email */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
            <div className="relative text-white">
              <label
                htmlFor="email_field"
                className="text-xs font-semibold text-gray-300"
              >
                Email
              </label>
              <FiMail className="absolute left-3 bottom-3 text-gray-400" />
              <input
                type="email"
                id="email_field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full h-11 mt-1 pl-10 pr-3 rounded-md border border-gray-400 bg-transparent text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-semibold transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
            <div className="relative text-white">
              <label
                htmlFor="otp_field"
                className="text-xs font-semibold text-gray-300"
              >
                Enter OTP
              </label>
              <FiAirplay className="absolute left-3 bottom-3 text-gray-400" />
              <input
                type="number"
                id="otp_field"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full h-11 mt-1 pl-10 pr-3 rounded-md border border-gray-400 bg-transparent text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-semibold transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
            <div className="relative text-white">
              <label
                htmlFor="password_field"
                className="text-xs font-semibold text-gray-300"
              >
                New Password
              </label>
              <FiLock className="absolute left-3 bottom-3 text-gray-400" />
              <input
                type="password"
                id="password_field"
                placeholder="Enter new password"
                className="w-full h-11 mt-1 pl-10 pr-3 rounded-md border border-gray-400 bg-transparent text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-green-600 hover:bg-green-500 text-white rounded-md font-semibold transition"
            >
              Change Password
            </button>
          </form>
        )}

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
