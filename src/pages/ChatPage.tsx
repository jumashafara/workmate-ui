import React, { useState, useEffect, useRef } from "react";
import logToTrubrics from "../api/Trubrics";
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Paper, 
  Card, 
  CardHeader, 
  CardContent, 
  InputAdornment,
  Divider,
  List,
  ListItemText,
  ListItemButton,
  Button,
  CircularProgress,
  Container,
  Link,
  ThemeProvider,
  createTheme
} from "@mui/material";
import { 
  Send as SendIcon, 
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  DeleteOutline as DeleteIcon
} from "@mui/icons-material";

import logToDATAIDEA from "../api/Dataidea";
import { API_ENDPOINT } from "../api/endpoints";

// Create a custom theme with orange as the primary color
const orangeTheme = createTheme({
  palette: {
    primary: {
      main: '#EA580C',
      light: '#FB8A4C',
      dark: '#C24000',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#EA580C',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#EA580C',
          },
        },
      },
    },
  },
});

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [conversationId] = useState<string>(() => {
    // Check if we have a stored conversationId in localStorage
    const storedId = localStorage.getItem("currentConversationId");
    if (storedId) return storedId;
    
    // Otherwise create a new one
    const newId = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
    
    // Store the new conversationId
    localStorage.setItem("currentConversationId", newId);
    return newId;
  });
  const [fullname, setFullname] = useState<string>("");
  const [hasStartedConversation, setHasStartedConversation] = useState(false);

  useEffect(() => {
    setFullname(localStorage.getItem("fullname") || "Unknown User");
    
    // Load saved messages
    const savedMessages = localStorage.getItem(`chat_messages_${conversationId}`);
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages) as Message[];
      setMessages(parsedMessages);
      setHasStartedConversation(parsedMessages.length > 0);
    }
    
    // Focus input on component mount
    inputRef.current?.focus();
  }, [conversationId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_messages_${conversationId}`, JSON.stringify(messages));
    }
  }, [messages, conversationId]);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    setHasStartedConversation(true);

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

        // Update the bot's message in real-time
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === botMessage.id ? { ...msg, text: receivedText } : msg
          )
        );
      }

      logToTrubrics(newMessage.text, receivedText, fullname, conversationId);
      logToDATAIDEA(newMessage.text, receivedText, fullname, conversationId);
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
        <Link
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          sx={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%',
            display: 'inline-block'
          }}
        >
          {part}
        </Link>
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

  // Updated clear chat function to also clear localStorage
  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(`chat_messages_${conversationId}`);
    setHasStartedConversation(false);
  };

  return (
    <ThemeProvider theme={orangeTheme}>
      <Container 
        maxWidth={isFloating ? false : "md"} 
        disableGutters={isFloating}
        sx={{ 
          height: isFloating ? '100%' : '80vh',
          display: 'flex',
          flexDirection: 'column',
          p: 0
        }}
      >
        <Card 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            borderRadius: 1,
            overflow: 'hidden',
            boxShadow: 3,
            bgcolor: 'background.paper'
          }}
        >
          {/* Header */}
          <CardHeader
            title={
              <Typography variant="h6" component="div">
                Chat with Workmate
              </Typography>
            }
            action={
              isFloating && onClose && (
                <IconButton 
                  onClick={onClose}
                  color="inherit" 
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              )
            }
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              p: 1.5
            }}
          />

          {/* Sample Questions */}
          {!isFloating && !hasStartedConversation && (
            <Paper 
              variant="outlined" 
              sx={{ 
                m: 2, 
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="h6">Try asking</Typography>
              </Box>
              <List sx={{ p: 0 }}>
                <ListItemButton 
                  onClick={() => setInput("What is Raising the Village?")}
                  sx={{ color: 'primary.main' }}
                >
                  <ListItemText primary="What is Raising the Village?" />
                </ListItemButton>
                <ListItemButton 
                  onClick={() => setInput("What is WASH?")}
                  sx={{ color: 'primary.main' }}
                >
                  <ListItemText primary="What is WASH?" />
                </ListItemButton>
                <ListItemButton 
                  onClick={() => setInput("What is the Master Score Card?")}
                  sx={{ color: 'primary.main' }}
                >
                  <ListItemText primary="What is the Master Score Card?" />
                </ListItemButton>
              </List>
            </Paper>
          )}

          {/* Chat Messages */}
          <CardContent 
            sx={{ 
              flexGrow: 1, 
              overflow: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            {messages.length > messageLimit && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleLoadMore}
                  startIcon={<ExpandMoreIcon />}
                  color="primary"
                >
                  Load More
                </Button>
              </Box>
            )}

            {displayedMessages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === "user" ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s ease-out forwards'
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: { xs: '85%', md: '70%' },
                    borderRadius: 2,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    ...(msg.sender === "user" 
                      ? { 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          borderTopRightRadius: 0
                        } 
                      : { 
                          bgcolor: 'background.default',
                          borderTopLeftRadius: 0
                        }
                    )
                  }}
                >
                  <Typography variant="body1" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {renderMessageText(msg.text)}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      textAlign: 'right',
                      mt: 0.5,
                      color: msg.sender === "user" ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                    }}
                  >
                    {msg.timestamp}
                  </Typography>
                </Paper>
              </Box>
            ))}

            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  animation: 'fadeIn 0.3s ease-out forwards',
                  p: 1
                }}
              >
                <CircularProgress size={20} color="primary" />
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
              color="primary"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      color="primary" 
                      onClick={handleSendMessage}
                      disabled={input.trim() === "" || loading}
                      edge="end"
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2
                }
              }}
            />

            {/* Clear Chat Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleClearChat}
                color="primary"
                size="small"
                variant="text"
              >
                Clear chat
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default ChatPage;
