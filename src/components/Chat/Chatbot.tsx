import React, { useState, useEffect, useRef } from "react";
import UserOne from '../../images/user/user-01.png';
import UserBot from '../../images/user/user-02.png';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Paper, 
  Avatar, 
  Card, 
  CardHeader, 
  CardContent, 
  InputAdornment,
  Divider,
  Tooltip
} from "@mui/material";
import { 
  Send as SendIcon, 
  SentimentSatisfiedAlt as EmojiIcon,
  Chat as ChatIcon
} from "@mui/icons-material";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("hello") || input.includes("hi")) {
      return "Hello there! How can I assist you today?";
    } else if (input.includes("help")) {
      return "I can help you with information about predictions, model statistics, or general questions about the system. What would you like to know?";
    } else if (input.includes("prediction") || input.includes("model")) {
      return "Our prediction models use machine learning to analyze data and provide insights. Would you like to know more about a specific aspect?";
    } else if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    } else {
      return "I'm not sure I understand. Could you please rephrase your question or ask something else?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatDate = (timestamp: string) => {
    return timestamp;
  };

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 48px)', 
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: 3
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar 
            sx={{ 
              bgcolor: 'primary.light',
              width: 40,
              height: 40
            }}
          >
            <ChatIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6" component="div">
            Workmate Assistant
          </Typography>
        }
        subheader="Online | Ready to help"
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          '& .MuiCardHeader-subheader': {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          p: 2
        }}
      />

      {/* Chat Area */}
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          bgcolor: 'background.default',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === "user" ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.3s ease-out forwards'
            }}
          >
            {msg.sender === "bot" && (
              <Avatar 
                src={UserBot} 
                alt="Bot" 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1,
                  alignSelf: 'flex-end'
                }} 
              />
            )}
            
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                maxWidth: { xs: '75%', md: '60%' },
                borderRadius: 2,
                ...(msg.sender === "user" 
                  ? { 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      borderTopRightRadius: 0
                    } 
                  : { 
                      bgcolor: 'background.paper',
                      borderTopLeftRadius: 0
                    }
                )
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'right',
                  mt: 0.5,
                  color: msg.sender === "user" ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              >
                {formatDate(msg.timestamp)}
              </Typography>
            </Paper>
            
            {msg.sender === "user" && (
              <Avatar 
                src={UserOne} 
                alt="User" 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  ml: 1,
                  alignSelf: 'flex-end'
                }} 
              />
            )}
          </Box>
        ))}
        
        {isTyping && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              animation: 'fadeIn 0.3s ease-out forwards'
            }}
          >
            <Avatar 
              src={UserBot} 
              alt="Bot" 
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 1,
                alignSelf: 'flex-end'
              }} 
            />
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                borderRadius: 2,
                borderTopLeftRadius: 0,
                bgcolor: 'background.paper'
              }}
            >
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'text.disabled',
                    animation: 'blink 1s infinite',
                    animationDelay: '0ms'
                  }} 
                />
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'text.disabled',
                    animation: 'blink 1s infinite',
                    animationDelay: '150ms'
                  }} 
                />
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'text.disabled',
                    animation: 'blink 1s infinite',
                    animationDelay: '300ms'
                  }} 
                />
              </Box>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      <Divider />

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          inputRef={inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="Emoji">
                  <IconButton size="small" color="primary">
                    <EmojiIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Send">
                  <span>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={handleSendMessage}
                      disabled={input.trim() === ""}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: 'background.default'
            }
          }}
        />
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 1 
          }}
        >
          Ask me anything about predictions, models, or how to use the system
        </Typography>
      </Box>
    </Card>
  );
};

export default ChatPage;

