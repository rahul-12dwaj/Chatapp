// src/components/ChatHeader.jsx
const ChatHeader = ({ activeChat }) => {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-700 bg-black">
      {activeChat ? (
        <h2 className="text-white font-semibold">
          {activeChat.participants.find((u) => u !== "currentUserId")}
        </h2>
      ) : (
        <h2 className="text-white font-semibold">Select a chat</h2>
      )}
    </div>
  );
};

export default ChatHeader;
