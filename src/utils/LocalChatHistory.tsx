import { ChatConversation, ChatMessage } from './ChatHistory';

class LocalChatHistoryAPI {
  private storageKey = 'workmate_chat_history';

  // Get all conversations for a user from localStorage
  getChatHistoryLocal(userName: string): ChatConversation[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const allHistory = JSON.parse(stored);
      return allHistory[userName] || [];
    } catch (error) {
      console.error('Error loading local chat history:', error);
      return [];
    }
  }

  // Save conversation to localStorage
  saveConversationLocal(userName: string, conversation: ChatConversation): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const allHistory = stored ? JSON.parse(stored) : {};
      
      if (!allHistory[userName]) {
        allHistory[userName] = [];
      }

      // Find existing conversation or add new one
      const existingIndex = allHistory[userName].findIndex(
        (conv: ChatConversation) => conv.conversation_id === conversation.conversation_id
      );

      if (existingIndex >= 0) {
        allHistory[userName][existingIndex] = conversation;
      } else {
        allHistory[userName].unshift(conversation);
      }

      // Sort by updated_at
      allHistory[userName].sort((a: ChatConversation, b: ChatConversation) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      localStorage.setItem(this.storageKey, JSON.stringify(allHistory));
      console.log('Conversation saved to local storage:', conversation.conversation_id);
    } catch (error) {
      console.error('Error saving conversation to local storage:', error);
    }
  }

  // Get specific conversation
  getConversationLocal(userName: string, conversationId: string): ChatConversation | null {
    const history = this.getChatHistoryLocal(userName);
    return history.find(conv => conv.conversation_id === conversationId) || null;
  }

  // Add message to conversation
  addMessageToConversation(
    userName: string, 
    conversationId: string, 
    messageText: string, 
    sender: 'user' | 'bot'
  ): void {
    try {
      const history = this.getChatHistoryLocal(userName);
      let conversation = history.find(conv => conv.conversation_id === conversationId);

      if (!conversation) {
        // Create new conversation
        conversation = {
          id: Date.now(),
          conversation_id: conversationId,
          user_name: userName,
          title: this.generateTitle(messageText),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: [],
          message_count: 0
        };
      }

      // Add message
      const newMessage: ChatMessage = {
        id: Date.now(),
        message_text: messageText,
        sender: sender,
        timestamp: new Date().toISOString()
      };

      if (!conversation.messages) {
        conversation.messages = [];
      }

      conversation.messages.push(newMessage);
      conversation.message_count = conversation.messages.length;
      conversation.updated_at = new Date().toISOString();

      // Update last message preview
      conversation.last_message = {
        text: messageText,
        sender: sender,
        timestamp: newMessage.timestamp
      };

      this.saveConversationLocal(userName, conversation);
    } catch (error) {
      console.error('Error adding message to local conversation:', error);
    }
  }

  // Delete conversation
  deleteConversationLocal(userName: string, conversationId: string): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;
      
      const allHistory = JSON.parse(stored);
      if (!allHistory[userName]) return;

      allHistory[userName] = allHistory[userName].filter(
        (conv: ChatConversation) => conv.conversation_id !== conversationId
      );

      localStorage.setItem(this.storageKey, JSON.stringify(allHistory));
      console.log('Conversation deleted from local storage:', conversationId);
    } catch (error) {
      console.error('Error deleting conversation from local storage:', error);
    }
  }

  // Generate a title from the first message
  private generateTitle(firstMessage: string): string {
    // Take first 50 characters and clean up
    let title = firstMessage.substring(0, 50).trim();
    if (firstMessage.length > 50) {
      title += '...';
    }
    return title || 'New Chat';
  }

  // Clear all history for a user
  clearAllHistory(userName: string): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;
      
      const allHistory = JSON.parse(stored);
      delete allHistory[userName];

      localStorage.setItem(this.storageKey, JSON.stringify(allHistory));
      console.log('All chat history cleared for user:', userName);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }
}

export default new LocalChatHistoryAPI();