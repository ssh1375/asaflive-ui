// src/services/socket/FakeBackend.ts
import { socket } from './MockSocket';
import type { User } from '../features/chat/type';

let isBackendInitialized = false;
let usersStore: User[] = [];

export const initFakeBackend = (users: User[] = []) => {
  if (users.length > 0) {
    usersStore = users;
  }

  if (isBackendInitialized) return;
  isBackendInitialized = true;

  console.log('[FakeBackend] Server is watching...');

  socket.on('SERVER_RECEIVE_send_message', (payload) => {
    console.log('[FakeBackend] Message received from client:', payload);

    const userMessage = {
      ...payload,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    socket.triggerLocal('receive_message', userMessage);

    if (payload.chatId && payload.chatId !== 'general') {
      const targetUser = usersStore.find((u) => u.id === payload.chatId);
      const targetName = targetUser?.name || 'کاربر';

      socket.triggerLocal('receive_typing', {
        senderId: payload.chatId,
        chatId: payload.chatId,
      });

      setTimeout(() => {
        const autoReply = {
          id: crypto.randomUUID(),
          senderId: payload.chatId,
          senderName: targetName,
          text: `${targetName} در پاسخ به پیام شما: "${payload.text}"`,
          timestamp: new Date().toISOString(),
          chatId: payload.chatId,
        };
        socket.triggerLocal('receive_message', autoReply);
      }, 1500);
    }
  });

  socket.on('SERVER_RECEIVE_typing', (payload: any) => {
    socket.triggerLocal('receive_typing', payload);
  });
};