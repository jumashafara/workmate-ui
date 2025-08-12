import { API_ENDPOINT } from "./endpoints";

export interface ChatFeedback {
  id: number;
  feedback_type: 'positive' | 'negative';
  user_name: string;
  created_at: string;
  updated_at: string;
}

class ChatFeedbackAPI {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  static async submitFeedback(
    messageId: number, 
    feedbackType: 'positive' | 'negative', 
    userName: string
  ): Promise<{ feedback: ChatFeedback; message: string }> {
    const response = await fetch(`${API_ENDPOINT}/chat/messages/feedback/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        message_id: messageId,
        feedback_type: feedbackType,
        user_name: userName
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit feedback');
    }

    return response.json();
  }

  static async removeFeedback(messageId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_ENDPOINT}/chat/messages/${messageId}/feedback/`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove feedback');
    }

    return response.json();
  }
}

export default ChatFeedbackAPI;