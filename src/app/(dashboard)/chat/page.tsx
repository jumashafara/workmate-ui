"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Send,
  History,
  Plus,
  Trash2,
  Bot,
  User,
  Copy,
  RefreshCw,
  MessageSquare,
  Loader2,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

// Orange theme colors matching workmate-frontend
const THEME_COLORS = {
  primary: {
    main: "#EA580C",
    light: "#FB8A4C",
    dark: "#C24000",
    contrastText: "#FFFFFF",
  },
};
import { getUserData } from "@/utils/cookie";
import logToTrubrics from "@/utils/Trubrics";
// import logToDATAIDEA from "@/utils/Dataidea"; // Temporarily disabled due to fetch errors
import ChatHistoryAPI, { ChatConversation } from "@/utils/ChatHistory";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [messageLimit, setMessageLimit] = useState(6);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatConversation[]>([]);
  const [conversationId, setConversationId] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null);
  const [conversationToDeleteTitle, setConversationToDeleteTitle] =
    useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [loadingConversationId, setLoadingConversationId] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation ID on client side only
  useEffect(() => {
    const storedId = localStorage.getItem("currentConversationId");
    if (storedId) {
      setConversationId(storedId);
    } else {
      const newId =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

      localStorage.setItem("currentConversationId", newId);
      localStorage.setItem(`isNewConversation_${newId}`, "true"); // Mark as new
      setConversationId(newId);
    }
  }, []);

  useEffect(() => {
    if (!conversationId) return; // Wait for conversationId to be initialized

    const userData = getUserData();
    setFullname(userData.full_name || "Unknown User");

    if (userData.full_name && conversationId) {
      // Check if this is a brand new conversation
      const isNewConversation = localStorage.getItem(
        `isNewConversation_${conversationId}`
      );

      if (isNewConversation === "true") {
        console.log(
          "New conversation detected, skipping API load:",
          conversationId
        );
        setMessages([]);
        setHasStartedConversation(false);
        // Remove the flag since we've handled it
        localStorage.removeItem(`isNewConversation_${conversationId}`);
      } else {
        console.log("Loading existing conversation:", conversationId);
        loadChatConversation(conversationId);
      }
    }

    inputRef.current?.focus();
  }, [conversationId]);

  useEffect(() => {
    if (fullname) {
      loadChatHistory();
    }
  }, [fullname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const startIndex = Math.max(0, messages.length - messageLimit);
    setDisplayedMessages(messages.slice(startIndex));
  }, [messages, messageLimit]);

  const loadChatHistory = async () => {
    if (!fullname) {
      console.log("No fullname available for loading chat history");
      return;
    }

    setLoadingHistory(true);
    try {
      console.log("Loading chat history for user:", fullname);

      const apiHistory = await ChatHistoryAPI.getChatHistory(fullname);

      if (apiHistory.length > 0) {
        console.log("Chat history loaded from API:", apiHistory);
        setChatHistory(apiHistory);
      } else {
        console.log("No API history found");
        setChatHistory([]);
      }
    } catch (error) {
      console.error("Failed to load chat history from API:", error);
      setChatHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const createNewChat = () => {
    const newId =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

    setMessages([]);
    setConversationId(newId);
    localStorage.setItem("currentConversationId", newId);
    localStorage.setItem(`isNewConversation_${newId}`, "true"); // Mark as new
    setHasStartedConversation(false);
    setIsHistoryOpen(false);
  };

  const loadChatConversation = async (convId: string) => {
    setLoadingConversationId(convId);
    try {
      console.log("Loading conversation from backend:", convId);
      // Remove new conversation flag since we're loading an existing one
      localStorage.removeItem(`isNewConversation_${convId}`);

      const conversation = await ChatHistoryAPI.getChatConversation(convId);
      console.log("Conversation loaded from API:", conversation);

      if (!conversation) {
        console.log("No conversation found, starting fresh");
        setMessages([]);
        setConversationId(convId);
        localStorage.setItem("currentConversationId", convId);
        setHasStartedConversation(false);
        setIsHistoryOpen(false);
        return;
      }

      const convertedMessages: Message[] =
        conversation.messages?.map((msg, index) => ({
          id: index + 1,
          text: msg.message_text,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp).toLocaleTimeString(),
        })) || [];

      setMessages(convertedMessages);
      setConversationId(convId);
      localStorage.setItem("currentConversationId", convId);
      setHasStartedConversation(convertedMessages.length > 0);
      setIsHistoryOpen(false);

      setChatHistory((prev) => {
        const existingIndex = prev.findIndex(
          (conv) => conv.conversation_id === convId
        );
        if (existingIndex >= 0) {
          const updatedHistory = [...prev];
          updatedHistory[existingIndex] = {
            ...conversation,
            message_count: convertedMessages.length,
            first_user_message:
              convertedMessages.find((msg) => msg.sender === "user")?.text ||
              undefined,
          };
          return updatedHistory;
        } else {
          return [
            {
              ...conversation,
              message_count: convertedMessages.length,
              first_user_message:
                convertedMessages.find((msg) => msg.sender === "user")?.text ||
                undefined,
            },
            ...prev,
          ];
        }
      });
    } catch (error: any) {
      console.log("Error loading conversation:", error);

      // Check if it's a 404 error (conversation doesn't exist)
      if (
        error.message?.includes("404") ||
        error.status === 404 ||
        error.response?.status === 404 ||
        error.message?.includes("HTTP error! status: 404")
      ) {
        console.log(
          "Conversation not found (404), starting fresh conversation"
        );
        setMessages([]);
        setConversationId(convId);
        localStorage.setItem("currentConversationId", convId);
        setHasStartedConversation(false);
        setIsHistoryOpen(false);
        return;
      }

      // For other errors, log them but don't crash the app
      console.error("Unexpected error loading conversation:", error);
      setMessages([]);
      setConversationId(convId);
      localStorage.setItem("currentConversationId", convId);
      setHasStartedConversation(false);
      setIsHistoryOpen(false);
    } finally {
      setLoadingConversationId(null);
    }
  };

  const openDeleteDialog = (convId: string, title: string) => {
    setConversationToDelete(convId);
    setConversationToDeleteTitle(title);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setConversationToDelete(null);
    setConversationToDeleteTitle("");
    setIsDeleting(false);
  };

  const confirmDeleteChatConversation = async () => {
    if (!conversationToDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      await ChatHistoryAPI.deleteChatConversation(conversationToDelete);
      console.log("Conversation deleted from API");

      setChatHistory((prev) =>
        prev.filter((conv) => conv.conversation_id !== conversationToDelete)
      );

      if (conversationToDelete === conversationId) {
        createNewChat();
      }

      closeDeleteDialog();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      setIsDeleting(false);
      // Don't close dialog on error so user can retry
    }
  };

  const saveMessageToBackend = async (
    messageText: string,
    sender: "user" | "bot"
  ) => {
    try {
      console.log(
        `Saving ${sender} message:`,
        messageText.substring(0, 50) + "..."
      );

      await ChatHistoryAPI.saveChatMessage(
        conversationId,
        messageText,
        sender,
        fullname
      );
      console.log("Message saved to API successfully");
    } catch (error) {
      console.error("Failed to save message to API:", error);
      throw error;
    }

    if (
      sender === "user" &&
      (!hasStartedConversation || messages.length <= 1)
    ) {
      const newConversation: ChatConversation = {
        id: Date.now(),
        conversation_id: conversationId,
        user_name: fullname,
        title: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message_count: 1,
        first_user_message: messageText,
        last_message: {
          text: messageText,
          sender: "user",
          timestamp: new Date().toISOString(),
        },
      };

      setChatHistory((prev) => {
        const existingIndex = prev.findIndex(
          (conv) => conv.conversation_id === conversationId
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...prev[existingIndex],
            first_user_message: messageText,
            message_count: 1,
            updated_at: new Date().toISOString(),
            last_message: {
              text: messageText,
              sender: "user",
              timestamp: new Date().toISOString(),
            },
          };
          return updated;
        } else {
          return [newConversation, ...prev];
        }
      });
    } else if (sender === "bot") {
      setChatHistory((prev) =>
        prev.map((conv) => {
          if (conv.conversation_id === conversationId) {
            return {
              ...conv,
              message_count: conv.message_count + 1,
              updated_at: new Date().toISOString(),
              last_message: {
                text:
                  messageText.length > 100
                    ? messageText.substring(0, 100) + "..."
                    : messageText,
                sender: "bot",
                timestamp: new Date().toISOString(),
              },
            };
          }
          return conv;
        })
      );
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setIsLoading(true);
    setHasStartedConversation(true);

    try {
      await saveMessageToBackend(newMessage.text, "user");
    } catch (error) {
      console.error("Failed to save user message to backend:", error);
    }

    const botMessage: Message = {
      id: messages.length + 2,
      text: "Thinking...",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    try {
      const url = `https://iankagera-prod--askfsdl-backend-stream-qa.modal.run/?query=${encodeURIComponent(
        newMessage.text
      )}&request_id=${encodeURIComponent(`${conversationId}`)}`;

      const response = await fetch(url);

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedText = "";
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        receivedText += decoder.decode(value, { stream: true });

        // On first chunk, clear the "Thinking..." text and set loading to false
        if (isFirstChunk) {
          setIsLoading(false);
          isFirstChunk = false;
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === botMessage.id ? { ...msg, text: receivedText } : msg
          )
        );
      }

      // Analytics logging - fire and forget (non-blocking)
      Promise.resolve().then(async () => {
        try {
          logToTrubrics(
            newMessage.text,
            receivedText,
            fullname,
            conversationId
          );
        } catch (error) {
          console.warn("Trubrics logging failed (non-critical):", error);
        }
      });

      // Temporarily disabled DATAIDEA logging due to fetch errors
      // Promise.resolve().then(async () => {
      //   try {
      //     await logToDATAIDEA(newMessage.text, receivedText, fullname, conversationId);
      //   } catch (error) {
      //     console.warn("DATAIDEA logging failed (non-critical):", error);
      //   }
      // });

      try {
        await saveMessageToBackend(receivedText, "bot");
      } catch (error) {
        console.error("Failed to save bot message to backend:", error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === botMessage.id
            ? {
                ...msg,
                text: "Sorry, I encountered an error. Please try again.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
        setCopiedMessageId(messageId);
        setTimeout(() => {
          setCopiedMessageId(null);
        }, 2000);
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
      }
    }
  };

  const handleLoadMore = () => {
    setMessageLimit((prev) => prev + 6);
  };

  const suggestedQuestions = [
    "What is Raising the Village?",
    "What is WASH?",
    "What is the Master Score Card?",
  ];

  const renderUserMessageText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s<>"]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 underline hover:text-blue-100 break-all"
        >
          {part.length > 50 ? `${part.substring(0, 50)}...` : part}
        </a>
      ) : (
        part
      )
    );
  };

  const renderBotMessageText = (text: string) => {
    const processedText = text.replace(
      /(^|\s)(https?:\/\/[^\s<>"]+)(\s|$)/g,
      "$1[$2]($2)$3"
    );

    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          a: ({ href, children }) => {
            const linkText =
              typeof children === "string" && children.length > 60
                ? `${children.substring(0, 60)}...`
                : children;

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:opacity-80 break-words"
                title={href}
              >
                {linkText}
              </a>
            );
          },
          code: ({ children, className, ...props }: any) => {
            const isInline = className?.includes("inline");
            if (isInline) {
              return (
                <code
                  className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-2">
                <code className="font-mono text-sm break-words" {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc pl-4 my-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 my-2">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          h1: ({ children }) => (
            <h1 className="text-lg font-bold mt-2 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold mt-2 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold mt-2 mb-2">{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-1 my-2 bg-muted/50 italic">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {processedText}
      </ReactMarkdown>
    );
  };

  return (
    <TooltipProvider>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
      <div className="flex h-[calc(100vh-2rem)] w-full max-w-none mx-auto px-4">
        {/* Main Chat Area */}
        <Card
          className="w-full flex flex-col bg-white border border-slate-200 overflow-hidden"
          style={{
            minHeight: "calc(100vh - 4rem)",
            height: "calc(100vh - 4rem)",
            borderRadius: "12px",
          }}
        >
          <CardHeader className="bg-white border-b border-slate-200 px-6 ">
            <div className="flex items-center justify-between w-full">
              {/* Left side - Title and Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-slate-900">
                    Workmate Chatbot
                  </h1>
                  <p className="text-xs text-slate-500">AI Assistant</p>
                </div>
              </div>

              {/* Right side - Action Buttons */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsHistoryOpen(true)}
                        className="h-9 w-9 p-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Chat History</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={createNewChat}
                        className="h-9 w-9 p-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>New Chat</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </CardHeader>

          <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="border-b border-gray-200 px-6 py-4">
                <SheetTitle
                  className="text-lg font-semibold mb-4 text-left"
                  style={{ color: THEME_COLORS.primary.main }}
                >
                  Chat History
                </SheetTitle>

                {/* New Chat Button */}
                <Button
                  onClick={createNewChat}
                  className="w-full justify-center gap-2 h-10 font-medium"
                  style={{
                    backgroundColor: THEME_COLORS.primary.main,
                    color: "white",
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </SheetHeader>

              {/* Chat History List */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-180px)] px-3 py-2">
                  {loadingHistory ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2
                        className="h-8 w-8 animate-spin mb-3"
                        style={{ color: THEME_COLORS.primary.main }}
                      />
                      <p className="text-sm text-muted-foreground">
                        Loading history...
                      </p>
                    </div>
                  ) : chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-sm text-muted-foreground text-center">
                        No chat history yet
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Start a conversation to see it here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {chatHistory.map((conversation) => (
                        <div
                          key={conversation.conversation_id}
                          className={cn(
                            "group relative rounded-lg p-3 cursor-pointer transition-all duration-200 border",
                            conversation.conversation_id === conversationId
                              ? "bg-orange-50 border-orange-200 shadow-sm"
                              : "border-transparent hover:bg-gray-50 hover:border-gray-200",
                            loadingConversationId ===
                              conversation.conversation_id &&
                              "opacity-60 cursor-wait"
                          )}
                          onClick={() => {
                            if (loadingConversationId) return; // Prevent clicks while loading
                            loadChatConversation(conversation.conversation_id);
                          }}
                        >
                          {/* Conversation Content */}
                          <div className="pr-8">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                                {conversation.first_user_message
                                  ? conversation.first_user_message.length > 60
                                    ? `${conversation.first_user_message.substring(
                                        0,
                                        60
                                      )}...`
                                    : conversation.first_user_message
                                  : "New Chat"}
                              </h3>
                              {loadingConversationId ===
                                conversation.conversation_id && (
                                <Loader2 className="h-4 w-4 animate-spin text-orange-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  conversation.updated_at
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {conversation.message_count} messages
                              </span>
                            </div>
                          </div>

                          {/* Delete Button */}
                          {/* Delete Button */}
                          {loadingConversationId !==
                            conversation.conversation_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(
                                  conversation.conversation_id,
                                  conversation.first_user_message
                                    ? conversation.first_user_message.length >
                                      30
                                      ? `${conversation.first_user_message.substring(
                                          0,
                                          30
                                        )}...`
                                      : conversation.first_user_message
                                    : "New Chat"
                                );
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive">
                  Delete Chat Conversation
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{conversationToDeleteTitle}"?
                  This action cannot be undone and all messages in this
                  conversation will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeDeleteDialog}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteChatConversation}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <ScrollArea className="flex-1" style={{ minHeight: "400px" }}>
              <div className="max-w-5xl mx-auto">
                {messages.length === 0 && !hasStartedConversation ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="max-w-md space-y-6">
                      <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                        <Bot className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">
                          How can I help you today?
                        </h2>
                        <p className="text-slate-600 text-base">
                          Ask me anything about Raising the Village, WASH
                          programs, or data collection.
                        </p>
                      </div>

                      <div className="grid gap-3 w-full">
                        {suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => setInput(question)}
                            className="p-4 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <MessageSquare className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                                {question}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-6">
                    {messages.length > messageLimit && (
                      <div className="flex justify-center mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLoadMore}
                          className="gap-2"
                          style={{
                            borderColor: THEME_COLORS.primary.main,
                            color: THEME_COLORS.primary.main,
                          }}
                        >
                          <RefreshCw
                            className="h-4 w-4"
                            style={{ color: THEME_COLORS.primary.main }}
                          />
                          Load More
                        </Button>
                      </div>
                    )}

                    {displayedMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex mb-4 animate-fadeIn w-full items-start gap-3",
                          message.sender === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        )}
                      >
                        {/* Avatar */}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                            message.sender === "user"
                              ? "bg-orange-500"
                              : "bg-slate-600"
                          )}
                        >
                          {message.sender === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={cn(
                            "max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 break-words",
                            message.sender === "user"
                              ? "bg-orange-500 text-white"
                              : "bg-slate-100 text-slate-900"
                          )}
                        >
                          <div className="break-words">
                            {message.sender === "user" ? (
                              <div className="whitespace-pre-wrap break-words text-white">
                                {renderUserMessageText(message.text)}
                              </div>
                            ) : (
                              <div className="break-words">
                                {message.text === "Thinking..." ? (
                                  <div className="flex items-center space-x-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                                    <span className="text-sm text-slate-500">
                                      Thinking...
                                    </span>
                                  </div>
                                ) : (
                                  renderBotMessageText(message.text)
                                )}
                              </div>
                            )}
                          </div>
                          <div
                            className={cn(
                              "text-xs mt-2 text-right flex items-center justify-end gap-2",
                              message.sender === "user"
                                ? "text-white/70"
                                : "text-slate-500"
                            )}
                          >
                            <span>{message.timestamp}</span>
                            {message.sender === "bot" &&
                              message.text &&
                              message.text !== "Thinking..." && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        copyToClipboard(
                                          message.text,
                                          message.id
                                        )
                                      }
                                      className="h-5 w-5 p-0 opacity-60 hover:opacity-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
                                    >
                                      {copiedMessageId === message.id ? (
                                        <Check className="h-3 w-3 text-green-500" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {copiedMessageId === message.id
                                      ? "Copied!"
                                      : "Copy message"}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex space-x-3 max-w-5xl mx-auto">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 border-slate-300 focus:border-orange-500 focus:ring-orange-500 bg-white placeholder-slate-400"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default ChatPage;
