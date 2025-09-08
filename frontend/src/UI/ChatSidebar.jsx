// src/components/ChatSidebar.jsx
const ChatSidebar = ({
  conversations = [],
  loading = false,
  activeChat,
  setActiveChat,
}) => {
  return (
    <div
      className={`flex flex-col w-full sm:w-1/4 border-r border-gray-700 transition-all duration-300 ${
        activeChat ? "hidden sm:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-black">
        <h2 className="text-lg font-semibold text-white">Messages</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar mt-2">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading chats...</p>
        ) : conversations.length > 0 ? (
          conversations.map((chat) => {
            const otherUser = chat.participants.find(
              (u) => u !== "currentUserId" // 🔥 replace with real user later
            );

            return (
              <div
                key={chat._id}
                onClick={() => setActiveChat(chat)}
                className="flex items-center gap-3 p-4 hover:bg-gray-700/50 transition cursor-pointer border-none last:border-none"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {otherUser || "Unknown User"}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {chat.updatedAt
                        ? new Date(chat.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {chat.messages?.[chat.messages.length - 1]?.content ||
                      "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-10">No messages found</p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
