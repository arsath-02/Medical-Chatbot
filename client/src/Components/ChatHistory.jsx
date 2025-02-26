import React from "react";
import { X } from "lucide-react";

export default function ChatHistory({ chatHistory, loadChat, handleToggleChatHistory }) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen absolute left-16 z-10">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-medium text-gray-800 dark:text-gray-200">Recent Chats</h2>
        <button onClick={handleToggleChatHistory} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chatHistory.map(chat => (
          <div
            key={chat.id}
            onClick={() => loadChat(chat.id)}
            className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{chat.title}</h3>
              <span className="text-xs text-gray-500">{chat.date}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.preview}</p>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors">
          View All Chats
        </button>
      </div>
    </div>
  );
}