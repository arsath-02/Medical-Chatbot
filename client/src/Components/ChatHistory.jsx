import React from "react";
import { X, Trash2, Calendar } from "lucide-react";

export default function ChatHistory({ chatHistory, loadChat, handleToggleChatHistory, currentSessionId }) {
  const deleteChat = async (sessionId, e) => {
    e.stopPropagation(); // Prevent clicking the parent div

    if (window.confirm("Are you sure you want to delete this chat?")) {
      try {
        const userId = localStorage.getItem("Email");
        const response = await fetch(`http://127.0.0.1:8000/api/chat/${sessionId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete chat");
        }

        // Refresh the page or update chat history
        window.location.reload();
      } catch (error) {
        console.error("Error deleting chat:", error);
        alert("Failed to delete chat. Please try again.");
      }
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen absolute left-16 z-10">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-medium text-gray-800 dark:text-gray-200">Recent Chats</h2>
        <button onClick={handleToggleChatHistory} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            <div
              key={chat.id}
              onClick={() => loadChat(chat.id)}
              className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer relative ${
                currentSessionId === chat.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate w-4/5">{chat.title}</h3>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full absolute right-2 top-2"
                >
                  <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                </button>
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{chat.date}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{chat.preview || "Click to load this chat"}</p>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <p>No chat history found</p>
            <p className="text-xs mt-2">Start a new conversation to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}