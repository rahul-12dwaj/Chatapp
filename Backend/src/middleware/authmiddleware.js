const jwt = require("jsonwebtoken");

// For Socket.IO
function socketAuth(socket, next) {
  const token = socket.handshake.auth.token; // token sent from frontend

  if (!token) {
    console.log("No token provided. Disconnecting:", socket.id);
    return next(new Error("Not authorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // attach user info to socket
    next();
  } catch (err) {
    console.log("Invalid token. Disconnecting:", socket.id);
    next(new Error("Invalid token"));
  }
}

module.exports = socketAuth;
