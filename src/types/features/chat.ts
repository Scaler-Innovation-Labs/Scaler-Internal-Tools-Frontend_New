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
  response: string;
  document_name: string;
  page_number: string;
  file_url: string;
}

export interface Message {
  content: string;
  messageType: 'user' | 'assistant' | 'system' | 'tool';
  metadata?: Record<string, any>;
} 