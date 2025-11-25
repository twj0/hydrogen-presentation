import { ReactNode } from 'react';

export type SlideLayout = 'cover' | 'default' | 'image-right' | 'image-left' | 'two-cols' | 'center';

export interface SlideData {
  id: number;
  layout: SlideLayout;
  title?: string;
  content: (step: number) => ReactNode;
  backgroundImage?: string;
  image?: string;
  clicks: number; // Total number of click steps
  ttsText: string; // Text for Text-to-Speech
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AiState {
  isOpen: boolean;
  mode: 'chat' | 'vision' | 'tts';
  isLoading: boolean;
  messages: ChatMessage[];
  analyzedImage?: string;
  analysisResult?: string;
}