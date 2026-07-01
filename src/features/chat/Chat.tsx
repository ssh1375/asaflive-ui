import React, { useEffect, useRef, useState } from 'react';
import type { Message } from './type';
import { useChatStore } from '../controls/ChatStore';
import { socket } from '../../services/MockSocket';
type ChatProps = {
  selectedUser: any;
  // chatMessages: ChatMessagesMap;
  // setChatMessages: React.Dispatch<React.SetStateAction<ChatMessagesMap>>;
};
const EMPTY_MESSAGES: Message[] = [];
// const GENERAL_CHAT_ID = 'general';

const Chat: React.FC<ChatProps> = ({ selectedUser }) => {
  const [inputText, setInputText] = useState('');
  const isTyping = useChatStore((state) => state.isTyping) || false;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = selectedUser?.id ?? 'general';
  const messages = useChatStore((state) => state.messagesByChat[chatId] ?? EMPTY_MESSAGES);
  const sendMessage = useChatStore((state) => state.sendMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setInputText('');
  }, [selectedUser]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim(), chatId);
    setInputText('');
  };

  const formatTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const chatTitle = selectedUser ? selectedUser.name : 'چت عمومی';
  const chatStatus = selectedUser ? 'آنلاین' : 'گفت‌وگوی گروهی';
  const typingText = selectedUser
    ? `${selectedUser.name} در حال تایپ...`
    : 'یکی از اعضا در حال تایپ...';
  const avatarText = selectedUser ? selectedUser.name.trim().charAt(0) : 'ع';

  return (
    <div
      dir="rtl"
      className="flex flex-col h-full bg-zinc-900 overflow-hidden font-sans "
    >
      <div className="bg-zinc-800/80 backdrop-blur-sm px-4 py-3 border-b border-zinc-700 flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <div className="w-9 h-9 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">
            {avatarText}
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-800 rounded-full" />
        </div>

        <div>
          <h2 className="text-zinc-100 font-semibold text-sm">{chatTitle}</h2>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            {chatStatus}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-600">
            <svg
              className="w-10 h-10 opacity-30"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              />
            </svg>
            <span className="text-sm text-center">
              {selectedUser
                ? `اولین پیام خود را برای ${selectedUser.name} ارسال کنید...`
                : 'اولین پیام خود را در چت عمومی ارسال کنید...'}
            </span>
          </div>
        ) : (
          messages.map((msg: Message) => {
            const isMe = msg.senderId === socket.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[78%] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${isMe ? 'self-start items-start' : 'self-end items-end'
                  }`}
              >
                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed shadow-md ${isMe
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-zinc-700 text-zinc-100 rounded-2xl rounded-tl-sm border border-zinc-600/50'
                    }`}
                >
                  {msg.text}
                </div>

                <span className="text-[10px] text-zinc-500 mt-1 px-1 flex items-center gap-1">
                  {formatTime(msg.timestamp)}

                  {!isMe && (
                    <span className="text-zinc-500 font-medium">
                      · {selectedUser ? selectedUser.name : 'عضو گروه'}
                    </span>
                  )}

                  {isMe && (
                    <svg
                      className="w-3 h-3 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="self-end items-end flex flex-col animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-zinc-700 border border-zinc-600/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 px-1">
              {typingText}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-zinc-800/80 backdrop-blur-sm px-3 py-3 border-t border-zinc-700 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-all active:scale-90"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              selectedUser
                ? `پیام به ${selectedUser.name}...`
                : 'پیام در چت عمومی...'
            }
            className="flex-1 bg-zinc-700/60 border border-zinc-600 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 disabled:active:scale-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 rotate-180 -translate-x-px"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
