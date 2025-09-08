// src/components/ChatMessages.jsx
const ChatMessages = ({ activeChat, currentUserId }) => {
  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-4 flex flex-col">
      {activeChat ? (
        activeChat.messages?.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs p-3 rounded-xl text-white ${
              msg.senderId === currentUserId
                ? "self-end bg-emerald-500"
                : "self-start bg-gray-700"
            }`}
          >
            {msg.content}
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a chat to start conversation
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
