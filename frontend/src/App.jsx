import { Routes, Route, Navigate } from "react-router-dom";

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
        <Route path="/dashboard/*" element={<Chat />}>
          {/* Default redirect to posts */}
          <Route index element={<Navigate to="posts" replace />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Join />} />
    </Routes>
  );
}

export default App;
