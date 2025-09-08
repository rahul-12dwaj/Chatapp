// src/components/ChatInput.jsx
const ChatInput = ({ activeChat, newMessage, setNewMessage, handleSend }) => {
  if (!activeChat) return null;

  return (
    <div className="p-4 border-t border-gray-700 bg-black flex gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 bg-black text-white text-sm rounded-xl px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
