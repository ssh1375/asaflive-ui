import { create } from 'zustand';
import { socket } from '../../services/MockSocket';
import type { User } from '../chat/type'; 

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  chatId: string;
}

export interface ChatStore {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;

  messagesByChat: Record<string, Message[]>;

  users: User[];
  setUsers: (users: User[]) => void;
  currentUserId: string | null;
  setCurrentUser: (userId: string) => void;

  isConnected: boolean;

  isTyping: boolean;
  sendTyping: (chatId: string) => void; // حالا chatId می‌گیرد

  initSocket: () => void;
  sendMessage: (text: string, chatId: string) => void;
}

let isSocketInitialized = false;
let typingTimeout: ReturnType<typeof setTimeout> | null = null;

export const useChatStore = create<ChatStore>((set, get) => ({
  isChatOpen: false,
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  messagesByChat: {},
  isConnected: false,
  isTyping: false,

  // مقدار اولیه و پیاده‌سازی متدهای کاربران
  users: [],
  setUsers: (users) => set({ users }),
  currentUserId: null,
  setCurrentUser: (userId) => set({ currentUserId: userId }),

  sendTyping: (chatId) => {
    socket.emit('typing', { senderId: socket.id, chatId });
  },

  initSocket: () => {
    if (isSocketInitialized) return;   // فقط یک‌بار اجرا شود
    isSocketInitialized = true;

    socket.connect();

    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));

    socket.on('receive_message', (newMessage: Message) => {
      set((state) => {
        const chatId = newMessage.chatId || 'general';
        const prevMessages = state.messagesByChat[chatId] || [];
        return {
          messagesByChat: {
            ...state.messagesByChat,
            [chatId]: [...prevMessages, newMessage],
          },
        };
      });
    });

    socket.on('receive_typing', (payload: { senderId: string; chatId: string }) => {
      if (payload.senderId !== socket.id) {
        set({ isTyping: true });
        if (typingTimeout) clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => set({ isTyping: false }), 3000);
      }
    });
  },

  sendMessage: (text, chatId) => {
    if (!text.trim()) return;
    const state = get();

    // پیدا کردن نام کاربر جاری از لیست users با currentUserId
    const currentUser = state.users.find((u) => u.id === state.currentUserId);
    const senderName = currentUser?.name;

    const payload = {
      senderId: socket.id,
      senderName,                // اضافه شدن نام فرستنده
      text: text.trim(),
      chatId,
    };

    socket.emit('send_message', payload);
  },
}));