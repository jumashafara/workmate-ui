import React, { useState } from "react";
import ChatPage from "../pages/ChatPage";

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[400px] h-[500px] shadow-2xl rounded-lg overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <ChatPage isFloating={true} onClose={() => setIsOpen(false)} />
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center w-14 h-14"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            fill="currentColor"
            viewBox="0 -960 960 960"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            fill="currentColor"
            viewBox="0 -960 960 960"
          >
            <path d="M240-400h480v-80H240v80Zm0 160h480v-80H240v80Zm0-320h480v-80H240v80ZM80-80v-800h800v800H80Z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
