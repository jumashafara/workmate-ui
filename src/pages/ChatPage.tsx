import React, { useState, useEffect, useRef } from "react";
import { SyncLoader } from "react-spinners";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface ChatPageProps {
  isFloating?: boolean;
  onClose?: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ isFloating = false, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [messageLimit, setMessageLimit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId] = useState<string>(crypto.randomUUID());
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    setUser(localStorage.getItem("user") || "");
    console.log(user);
  }, []);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `http://localhost:8000/chat/history/${user}/`
        );
        const history = await response.json();

        const formattedMessages = history
          .map((msg: any, index: number) => [
            {
              id: index * 2,
              text: msg.sent,
              sender: "user",
              timestamp: new Date(msg.timestamp).toLocaleTimeString(),
            },
            {
              id: index * 2 + 1,
              text: msg.received,
              sender: "bot",
              timestamp: new Date(msg.timestamp).toLocaleTimeString(),
            },
          ])
          .flat();

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    loadChatHistory();
  }, [user]);

  // Update displayed messages when messages or limit changes
  useEffect(() => {
    const startIndex = Math.max(0, messages.length - messageLimit);
    setDisplayedMessages(messages.slice(startIndex));
  }, [messages, messageLimit]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setLoading(true);

    // Initialize an empty bot message
    const botMessage: Message = {
      id: messages.length + 2,
      text: "",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    try {
      const url = `https://iankagera-prod--askfsdl-backend-stream-qa.modal.run/?query=${encodeURIComponent(
        newMessage.text
      )}&request_id=${encodeURIComponent(`${user}`)}`;

      const response = await fetch(url);

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        receivedText += decoder.decode(value, { stream: true });

        // Update the bot's message in real-time
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === botMessage.id ? { ...msg, text: receivedText } : msg
          )
        );
      }

      // After receiving complete response, store the chat
      await fetch("http://localhost:8000/chat/store/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add your authentication headers here
        },
        body: JSON.stringify({
          // add user
          user: user,
          sent: newMessage.text,
          received: receivedText,
          conversation_id: conversationId,
        }),
      });
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to make URLs clickable
  const renderMessageText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary "
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleLoadMore = () => {
    setMessageLimit((prev) => prev + 6);
  };

  return (
    <div
      className={`flex flex-col ${
        isFloating ? "h-full" : "h-5/6"
      } bg-transparent ${isFloating ? "w-full" : "md:w-3/4 m-auto"}`}
    >
      {/* Header */}
      <div className="p-3 bg-primary text-white text-lg font-semibold shadow-md rounded-sm flex justify-between items-center">
        <span>Chat with Workmate</span>
        <div className="flex items-center gap-2">
          {isFloating && onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                fill="currentColor"
                viewBox="0 -960 960 960"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Only show sample questions when not in floating mode */}
      {!isFloating && (
        <div className="mt-6 border border-gray-300 rounded-sm dark:border-gray-600">
          <h2 className="text-lg font-semibold p-6 bg-gray-200 dark:bg-gray-600">
            Try asking
          </h2>
          <ul className="bg-white p-6 dark:bg-gray-900">
            <li
              className="text-primary cursor-pointer"
              onClick={() => {
                setInput("What is Raising the Village?");
              }}
            >
              What is Raising the Village?
            </li>
            <li
              className="text-primary cursor-pointer"
              onClick={() => {
                setInput("What is WASH?");
              }}
            >
              What is WASH?
            </li>
            <li
              className="text-primary cursor-pointer"
              onClick={() => {
                setInput("What is the Master Score Card?");
              }}
            >
              What is the Master Score Card?
            </li>
          </ul>
        </div>
      )}

      {/* Chat Area */}
      <div
        className={`flex-1 overflow-y-auto ${
          isFloating ? "py-2" : "py-6"
        } space-y-2 px-2`}
      >
        {messages.length > displayedMessages.length && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handleLoadMore}
              className="text-primary hover:text-primary/80 px-4 py-2 rounded-sm border border-primary"
            >
              Load More
            </button>
          </div>
        )}

        {displayedMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                isFloating ? "max-w-[85%]" : "max-w-xs md:max-w-2xl"
              } rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
            >
              <div
                className={`border-b ${
                  isFloating ? "py-2 px-4" : "py-4 px-6.5"
                } dark:border-strokedark ${
                  msg.sender == "user" ? "border-primary" : "border-y-gray-300"
                }`}
              >
                <h3 className="font-medium text-black dark:text-white">
                  {msg.sender == "bot" ? (
                    <div className="flex space-x-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#999"
                      >
                        <path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z" />
                      </svg>
                      <span className={`${isFloating ? "text-sm" : ""}`}>
                        {" "}
                        Workmate{" "}
                      </span>
                    </div>
                  ) : (
                    <div className="flex space-x-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#EA580C"
                      >
                        <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260Zm0 180q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                      </svg>
                      <span className={`${isFloating ? "text-sm" : ""}`}>
                        {" "}
                        You
                      </span>
                    </div>
                  )}
                </h3>
              </div>
              <div
                className={`flex flex-col gap-2 ${
                  isFloating ? "p-4" : "p-6.5"
                }`}
              >
                <div
                  className={`${
                    isFloating ? "text-sm" : "text-base"
                  } overflow-x-hidden`}
                >
                  {renderMessageText(msg.text)}
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 text-primary flex flex-row rounded-sm">
        {loading && (
          <div className="px-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#999"
            >
              <path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z" />
            </svg>
          </div>
        )}
        <SyncLoader loading={loading} size={8} color="#999" />
      </div>

      {/* Input Area */}
      <div className="p-2 border bg-white dark:border-gray-600 dark:bg-gray-800 rounded-sm">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={`flex-1 p-2 border dark:border-gray-600 focus:outline-none focus:border-primary dark:bg-gray-900 dark:text-white rounded-sm ${
              isFloating ? "text-sm" : ""
            }`}
          />
          <button onClick={handleSendMessage} className="text-white px-3 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#EA580C"
            >
              <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Clear Chat Button */}
      <div className="flex justify-center py-2">
        <button
          onClick={() => setMessages([])}
          className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            fill="currentColor"
            viewBox="0 -960 960 960"
          >
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
          Clear chat
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
