import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./components/Chat";
import Join from "./components/Join";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Join />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Chat />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Join />} />
    </Routes>
  );
}

export default App;
