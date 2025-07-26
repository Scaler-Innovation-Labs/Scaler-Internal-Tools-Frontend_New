export interface ChatBotDocResponseDto {
  id: number;
  documentName: string;
  fileUrl: string;
}

export interface ChatBotDocCreateDto {
  documentName: string;
  file: File;
}

export interface ChatResponse {
  conversationId: string;
  answer: string;
  history: Message[];
}

export interface Message {
  content: string;
  messageType: 'user' | 'assistant' | 'system' | 'tool';
  metadata?: Record<string, any>;
} 