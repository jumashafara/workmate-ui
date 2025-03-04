import React, { useState } from "react";
import ChatPage from "../pages/ChatPage";
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 -right-1/2 w-[95vw] md:w-[400px] h-[80vh] md:h-[500px] shadow-2xl rounded-lg overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <ChatPage isFloating={true} onClose={() => setIsOpen(false)} />
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-primary/90 text-white p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center w-12 h-12 md:w-14 md:h-14"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <CloseIcon />
        ) : (
          <ChatIcon />
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
