import { API_ENDPOINT } from './endpoints';

export interface ChatMessage {
  id: number;
  message_text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface ChatConversation {
  id: number;
  conversation_id: string;
  user_name: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
  message_count: number;
  last_message?: {
    text: string;
    sender: 'user' | 'bot';
    timestamp: string;
  };
  first_user_message?: string;
}

class ChatHistoryAPI {
  private baseUrl = `${API_ENDPOINT}/chat`;

  async getChatHistory(userName: string): Promise<ChatConversation[]> {
    try {
      const url = `${this.baseUrl}/conversations/?user_name=${encodeURIComponent(userName)}`;
      console.log('Fetching chat history from:', url);
      
      const response = await fetch(url);
      console.log('Chat history response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat history API error:', response.status, errorText);
        
        // If the endpoint doesn't exist (404), return empty array for now
        if (response.status === 404) {
          console.warn('Chat history endpoint not found, returning empty array');
          return [];
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Chat history data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Return empty array if the feature is not available yet
      return [];
    }
  }

  async getChatConversation(conversationId: string): Promise<ChatConversation> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${encodeURIComponent(conversationId)}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat conversation:', error);
      throw error;
    }
  }

  async createChatConversation(conversationId: string, userName: string, title?: string): Promise<ChatConversation> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          user_name: userName,
          title: title
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating chat conversation:', error);
      throw error;
    }
  }

  async saveChatMessage(
    conversationId: string, 
    messageText: string, 
    sender: 'user' | 'bot', 
    userName?: string
  ): Promise<ChatMessage> {
    try {
      const url = `${this.baseUrl}/messages/save/`;
      console.log('Saving message to:', url);
      
      const payload = {
        conversation_id: conversationId,
        message_text: messageText,
        sender: sender,
        user_name: userName
      };
      console.log('Message payload:', payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('Save message response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save message API error:', response.status, errorText);
        
        // If the endpoint doesn't exist, return a mock response
        if (response.status === 404) {
          console.warn('Save message endpoint not found, returning mock response');
          return {
            id: Date.now(),
            message_text: messageText,
            sender: sender,
            timestamp: new Date().toISOString()
          };
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Message saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving chat message:', error);
      // Return a mock response if the API is not available
      return {
        id: Date.now(),
        message_text: messageText,
        sender: sender,
        timestamp: new Date().toISOString()
      };
    }
  }

  async deleteChatConversation(conversationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${encodeURIComponent(conversationId)}/delete/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting chat conversation:', error);
      throw error;
    }
  }

  async updateChatTitle(conversationId: string, title: string): Promise<ChatConversation> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${encodeURIComponent(conversationId)}/title/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating chat title:', error);
      throw error;
    }
  }
}

export default new ChatHistoryAPI();