export interface Message {
  id: string;
  text: string;
  senderId: string; 
  senderName?: string;         
  timestamp: string;
  chatId: string;               
}

export type User = {
  id: string;
  name: string;
  hasVideo: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
};

export type ChatMessagesMap = Record<string, Message[]>;