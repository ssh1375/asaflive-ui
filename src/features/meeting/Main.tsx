import React, { useEffect, useState } from 'react';
import LiveMonitor from './LiveMonitor';
import Chat from '../chat/Chat';
import UserSlider from '../lobby/UserSlider';
import type { User } from '../lobby/UserSlider';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';
import ChatPage from '../chat/ChatPage';
import { useChatStore } from '../controls/ChatStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { initFakeBackend } from '../../services/FakeBackend.js';
const mockUsers: User[] = [
    { id: '1', name: 'علی رضایی', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '2', name: 'رضا فروغ نیا (شما)', hasVideo: true, isMuted: false, isSpeaking: true },
    { id: '3', name: 'محمد کریمی', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '4', name: 'John Doe', hasVideo: false, isMuted: false, isSpeaking: false },
    { id: '5', name: 'مریم حسینی', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '6', name: 'امیر ساجدی', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '7', name: 'مسیحا مینایی', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '8', name: 'سیما رودسر', hasVideo: false, isMuted: false, isSpeaking: true },
    { id: '9', name: 'مجید ارژندی', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '10', name: 'ایمان روحپرور', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '11', name: 'نسترن غلامشاهی', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '12', name: 'مجید خورشیدی', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '13', name: 'آرمان فتحی', hasVideo: false, isMuted: true, isSpeaking: false },
    { id: '14', name: 'آرزو ناجی', hasVideo: false, isMuted: false, isSpeaking: false },
    { id: '15', name: 'آیوا اسماعیلی', hasVideo: false, isMuted: false, isSpeaking: false },

];

const Main: React.FC = () => {
    const { isChatOpen, toggleChat } = useChatStore();
    const setUsers = useChatStore(state => state.setUsers);
    const setCurrentUser = useChatStore(state => state.setCurrentUser);
    const initSocket = useChatStore(state => state.initSocket);

    const isDesktop = useMediaQuery('(min-width: 768px)');
    useEffect(() => {
        initFakeBackend();
        initSocket();
    }, [initSocket]);
    useEffect(() => {
        setUsers(mockUsers);
        setCurrentUser('2');
        initFakeBackend(mockUsers);
        initSocket();
    }, []);

    return (
        <div className="flex h-screen w-full bg-[rgb(var(--bg))] text-[rgb(var(--bg))] overflow-hidden font-sans relative">



            <main className="flex-1 relative flex flex-col bg-[rgb(var(--bg-secondary))]-900 w-full overflow-hidden">

                <div className="w-full bg-[rgb(var(--bg))]/20 backdrop-blur-sm px-1">
                    <UserSlider users={mockUsers} />
                </div>

                <div className="flex-1 relative bottom-5 w-full h-20  md:pb-0 flex items-center justify-center  overflow-hidden">
                    <div className="relative w-full max-w-[125vh] aspect-video bg-[rgb(var(--bg))] rounded-xl overflow-hidden shadow-2xl border border-zinc-800">

                        <video
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                        // src="your-stream-url"
                        />

                        <LiveMonitor
                            locationName="Tehran, Iran"
                            coordinates="35.6892° N, 51.3890° E"
                            watermark="MY_BRAND_LIVE"
                        />
                    </div>

                </div>


                <div className="absolute bottom-0 w-full h-16 bg-[rgb(var(--bg-secondary))]-800/90 backdrop-blur-md flex items-center justify-center gap-2 sm:gap-4 md:gap-6 border-t border-zinc-700 px-2 z-30">
                    <button className=" text-blue-500 p-2 text-sm md:text-base rounded-lg transition">سکوت </button>
                    <button className=" text-blue-500 p-2 text-sm md:text-base rounded-lg transition hidden sm:block">توقف</button>
                    <button
                        onClick={toggleChat}
                        className={`p-2 text-sm text-blue-600 md:text-base rounded-lg transition ${isChatOpen ? 'bg-blue-400' : 'hover:bg-[rgb(var(--bg-secondary))]-700'}`}
                    >
                        چت
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 px-3 py-1 md:px-4 md:py-1 rounded-md font-bold text-sm md:text-base ml-auto md:ml-0">پایان</button>
                    {/* <ThemeSwitcher /> */}

                </div>
            </main>

            <AnimatePresence>
                {isChatOpen && (
                    <motion.aside
                        initial={{
                            opacity: 0,
                            x: isDesktop ? '100%' : 0,
                            y: !isDesktop ? '100%' : 0,
                            scale: 1,
                            filter: 'blur(9px)',
                        }}

                        animate={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                            scale: 1,
                            filter: 'blur(0px)',

                        }}

                        exit={{
                            opacity: 0,
                            x: isDesktop ? '110%' : 0,
                            y: !isDesktop ? '110%' : 0,
                            scale: 0.95,
                            filter: 'blur(9px)',
                        }}

                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                            mass: 0.8,
                        }}

                        style={{
                            transformOrigin: isDesktop ? "right center" : "bottom center"
                        }}

                        className="absolute inset-0 md:relative z-50 md:z-auto w-full sm:w-80 md:w-96 h-full bg-zinc-800 border-l border-zinc-700 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.3)] md:shadow-none"
                    >
                        <div className="flex-1 overflow-y-auto">
                            <ChatPage users={mockUsers} />
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Main;
