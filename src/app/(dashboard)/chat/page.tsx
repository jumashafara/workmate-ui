"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Send,
  History,
  Plus,
  Trash2,
  Bot,
  User,
  Copy,
  MoreVertical,
  RefreshCw,
  MessageSquare,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

// Orange theme colors matching workmate-frontend
const THEME_COLORS = {
  primary: {
    main: '#EA580C',
    light: '#FB8A4C', 
    dark: '#C24000',
    contrastText: '#FFFFFF',
  }
};
import { getUserData } from "@/utils/ccokie";
import logToTrubrics from "@/utils/Trubrics";
import logToDATAIDEA from "@/utils/Dataidea";
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
  const [conversationId, setConversationId] = useState<string>(() => {
    const storedId = localStorage.getItem("currentConversationId");
    if (storedId) return storedId;
    
    const newId = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
    
    localStorage.setItem("currentConversationId", newId);
    return newId;
  });
  const [fullname, setFullname] = useState<string>("");
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [conversationToDeleteTitle, setConversationToDeleteTitle] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userData = getUserData();
    setFullname(userData.full_name || "Unknown User");
    
    if (userData.full_name) {
      loadChatConversation(conversationId).catch(() => {
        console.log('No conversation found in backend for conversationId:', conversationId);
        setMessages([]);
        setHasStartedConversation(false);
      });
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
      console.log('No fullname available for loading chat history');
      return;
    }
    
    setLoadingHistory(true);
    try {
      console.log('Loading chat history for user:', fullname);
      
      const apiHistory = await ChatHistoryAPI.getChatHistory(fullname);
      
      if (apiHistory.length > 0) {
        console.log('Chat history loaded from API:', apiHistory);
        setChatHistory(apiHistory);
      } else {
        console.log('No API history found');
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Failed to load chat history from API:', error);
      setChatHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const createNewChat = () => {
    const newId = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
    
    setMessages([]);
    setConversationId(newId);
    localStorage.setItem("currentConversationId", newId);
    setHasStartedConversation(false);
    setIsHistoryOpen(false);
  };

  const loadChatConversation = async (convId: string) => {
    try {
      console.log('Loading conversation from backend:', convId);
      const conversation = await ChatHistoryAPI.getChatConversation(convId);
      console.log('Conversation loaded from API:', conversation);

      if (!conversation) {
        console.log('Conversation not found in backend');
        throw new Error('Conversation not found');
      }
      
      const convertedMessages: Message[] = conversation.messages?.map((msg, index) => ({
        id: index + 1,
        text: msg.message_text,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp).toLocaleTimeString()
      })) || [];

      setMessages(convertedMessages);
      setConversationId(convId);
      localStorage.setItem("currentConversationId", convId);
      setHasStartedConversation(convertedMessages.length > 0);
      setIsHistoryOpen(false);
      
      setChatHistory(prev => {
        const existingIndex = prev.findIndex(conv => conv.conversation_id === convId);
        if (existingIndex >= 0) {
          const updatedHistory = [...prev];
          updatedHistory[existingIndex] = {
            ...conversation,
            message_count: convertedMessages.length,
            first_user_message: convertedMessages.find(msg => msg.sender === 'user')?.text || undefined
          };
          return updatedHistory;
        } else {
          return [{
            ...conversation,
            message_count: convertedMessages.length,
            first_user_message: convertedMessages.find(msg => msg.sender === 'user')?.text || undefined
          }, ...prev];
        }
      });
    } catch (error) {
      console.error('Failed to load conversation from backend:', error);
      throw error;
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
    setConversationToDeleteTitle('');
  };

  const confirmDeleteChatConversation = async () => {
    if (!conversationToDelete) return;

    try {
      await ChatHistoryAPI.deleteChatConversation(conversationToDelete);
      console.log('Conversation deleted from API');
      
      setChatHistory(prev => prev.filter(conv => conv.conversation_id !== conversationToDelete));
      
      if (conversationToDelete === conversationId) {
        createNewChat();
      }
      
      closeDeleteDialog();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      closeDeleteDialog();
    }
  };

  const saveMessageToBackend = async (messageText: string, sender: 'user' | 'bot') => {
    try {
      console.log(`Saving ${sender} message:`, messageText.substring(0, 50) + '...');
      
      await ChatHistoryAPI.saveChatMessage(conversationId, messageText, sender, fullname);
      console.log('Message saved to API successfully');
      
    } catch (error) {
      console.error('Failed to save message to API:', error);
      throw error;
    }
    
    if (sender === 'user' && (!hasStartedConversation || messages.length <= 1)) {
      const newConversation: ChatConversation = {
        id: Date.now(),
        conversation_id: conversationId,
        user_name: fullname,
        title: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message_count: 1,
        first_user_message: messageText,
        last_message: {
          text: messageText,
          sender: 'user',
          timestamp: new Date().toISOString()
        }
      };
      
      setChatHistory(prev => {
        const existingIndex = prev.findIndex(conv => conv.conversation_id === conversationId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...prev[existingIndex],
            first_user_message: messageText,
            message_count: 1,
            updated_at: new Date().toISOString(),
            last_message: {
              text: messageText,
              sender: 'user',
              timestamp: new Date().toISOString()
            }
          };
          return updated;
        } else {
          return [newConversation, ...prev];
        }
      });
    } else if (sender === 'bot') {
      setChatHistory(prev => prev.map(conv => {
        if (conv.conversation_id === conversationId) {
          return {
            ...conv,
            message_count: conv.message_count + 1,
            updated_at: new Date().toISOString(),
            last_message: {
              text: messageText.length > 100 ? messageText.substring(0, 100) + '...' : messageText,
              sender: 'bot',
              timestamp: new Date().toISOString()
            }
          };
        }
        return conv;
      }));
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
      console.error('Failed to save user message to backend:', error);
    }

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
      )}&request_id=${encodeURIComponent(`${conversationId}`)}`;

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

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === botMessage.id ? { ...msg, text: receivedText } : msg
          )
        );
      }

      logToTrubrics(newMessage.text, receivedText, fullname, conversationId);
      logToDATAIDEA(newMessage.text, receivedText, fullname, conversationId);
      
      try {
        await saveMessageToBackend(receivedText, "bot");
      } catch (error) {
        console.error('Failed to save bot message to backend:', error);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const clearCurrentChat = () => {
    setMessages([]);
    setHasStartedConversation(false);
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
      '$1[$2]($2)$3'
    );
    
    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-2 last:mb-0">{children}</p>
          ),
          a: ({ href, children }) => {
            const linkText = typeof children === 'string' && children.length > 60 
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
          code: ({ inline, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
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
          ul: ({ children }) => <ul className="list-disc pl-4 my-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 my-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          h1: ({ children }) => <h1 className="text-lg font-bold mt-2 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold mt-2 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-2">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-1 my-2 bg-muted/50 italic">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      <div className="flex h-[calc(100vh-2rem)] max-w-7xl mx-auto p-4 gap-4">
        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col shadow-lg border-0 overflow-hidden">
          <CardHeader className="p-0" style={{ backgroundColor: THEME_COLORS.primary.main, color: THEME_COLORS.primary.contrastText }}>
            <div className="flex items-center justify-between w-full px-6 py-4">
              {/* Left side - Title and Logo */}
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6 text-white" />
                <h1 className="text-xl font-semibold text-white">
                  Chat with Workmate
                </h1>
              </div>
              
              {/* Right side - Action Buttons */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsHistoryOpen(true)} 
                      className="text-white hover:bg-white/10 h-9 w-9 p-0"
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
                      className="text-white hover:bg-white/10 h-9 w-9 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Chat</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>

          <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <SheetContent side="left" className="w-80 p-0">
              {/* Header Section */}
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold mb-4" style={{ color: THEME_COLORS.primary.main }}>
                  Chat History
                </h2>
                
                {/* New Chat Button */}
                <Button 
                  onClick={createNewChat} 
                  className="w-full justify-center gap-2 h-10 font-medium"
                  style={{ backgroundColor: THEME_COLORS.primary.main, color: 'white' }}
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>

              {/* Chat History List */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-180px)] px-3 py-2">
                  {loadingHistory ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mb-3" style={{ color: THEME_COLORS.primary.main }} />
                      <p className="text-sm text-muted-foreground">Loading history...</p>
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
                              : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                          )}
                          onClick={() => loadChatConversation(conversation.conversation_id)}
                        >
                          {/* Conversation Content */}
                          <div className="pr-8">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                              {conversation.first_user_message 
                                ? (conversation.first_user_message.length > 60 
                                    ? `${conversation.first_user_message.substring(0, 60)}...`
                                    : conversation.first_user_message)
                                : 'New Chat'
                              }
                            </h3>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {new Date(conversation.updated_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {conversation.message_count} messages
                              </span>
                            </div>
                          </div>
                          
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(
                                conversation.conversation_id, 
                                conversation.first_user_message 
                                  ? (conversation.first_user_message.length > 30 
                                      ? `${conversation.first_user_message.substring(0, 30)}...`
                                      : conversation.first_user_message)
                                  : 'New Chat'
                              );
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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
                <DialogTitle className="text-destructive">Delete Chat Conversation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{conversationToDeleteTitle}"? 
                  This action cannot be undone and all messages in this conversation will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeDeleteDialog}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteChatConversation}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-6">
              {messages.length === 0 && !hasStartedConversation ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Chat with Workmate</h2>
                    <p className="text-muted-foreground">
                      Ask me anything about Raising the Village, WASH programs, or data collection.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 max-w-md w-full">
                    <div className="rounded-lg p-4 mb-2" style={{ backgroundColor: '#FFF7ED' }}>
                      <h3 className="font-medium mb-3" style={{ color: THEME_COLORS.primary.main }}>Try asking</h3>
                    </div>
                    {suggestedQuestions.map((question, index) => (
                      <div 
                        key={index}
                        className="cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 border border-gray-200 rounded-lg p-4"
                        onClick={() => setInput(question)}
                      >
                        <div className="flex items-center gap-2" style={{ color: THEME_COLORS.primary.main }}>
                          <MessageSquare className="h-4 w-4" />
                          <p className="text-sm font-medium">{question}</p>
                        </div>
                      </div>
                    ))}
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
                        style={{ borderColor: THEME_COLORS.primary.main, color: THEME_COLORS.primary.main }}
                      >
                        <RefreshCw className="h-4 w-4" style={{ color: THEME_COLORS.primary.main }} />
                        Load More
                      </Button>
                    </div>
                  )}
                  
                  {displayedMessages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className={cn(
                            "text-white text-xs font-medium",
                            message.sender === "user" ? "bg-primary" : "bg-secondary"
                          )}>
                            {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant={message.sender === "user" ? "default" : "secondary"}>
                              {message.sender === "user" ? "You" : "Workmate"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </span>
                          </div>
                          <div className="prose prose-sm max-w-none dark:prose-invert break-words">
                            {message.sender === "user" ? (
                              <div className="whitespace-pre-wrap break-words">
                                {renderUserMessageText(message.text)}
                              </div>
                            ) : (
                              <div className="break-words">
                                {renderBotMessageText(message.text)}
                              </div>
                            )}
                          </div>
                          {message.sender === "bot" && message.text && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(message.text)}
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-secondary text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">Workmate</Badge>
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-6 space-y-3">
              <div className="flex space-x-2">
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
                  className="flex-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                  style={{
                    borderColor: '#D1D5DB',
                    ':focus': {
                      borderColor: THEME_COLORS.primary.main,
                      boxShadow: `0 0 0 1px ${THEME_COLORS.primary.main}`
                    }
                  }}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="flex-shrink-0"
                  style={{ backgroundColor: THEME_COLORS.primary.main, borderColor: THEME_COLORS.primary.main }}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Send className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
              
              {messages.length > 0 && (
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCurrentChat}
                    className="gap-2"
                    style={{ color: THEME_COLORS.primary.main }}
                  >
                    <Trash2 className="h-3 w-3" style={{ color: THEME_COLORS.primary.main }} />
                    Clear chat
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default ChatPage;