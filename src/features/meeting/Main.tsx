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
import MediaTestEnvironment from '../lobby/MediaTester.js';
import Modal from '../../shared/Modal.js';
import { useDeviceType } from '../../hooks/useDeviceType.js';
import MobileMediaTester from '../lobby/MobileMediaTester.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MemberForm, type MemberFormData } from '../../shared/MemberForm.js';


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

    const [isMediaTestOpen, setIsMediaTestOpen] = useState(false);
    const deviceType = useDeviceType();
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const navigate = useNavigate();
    const [inviteUser, setInviteUser] = useState(false);

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
    useEffect(() => setIsMediaTestOpen(true), [])
    const handleSubmit = (data: MemberFormData) => {
        // onAddUser?.(data);     
        setInviteUser(false);
    };
    return (
        <div className="flex h-screen w-full bg-[rgb(var(--bg))] text-[rgb(var(--bg))] overflow-hidden font-sans relative">



            <main className="flex-1 relative flex flex-col bg-[rgb(var(--bg-secondary))]-900 w-full overflow-hidden">

                <div className="w-full bg-[rgb(var(--bg))]/20 backdrop-blur-sm px-1">
                    <UserSlider users={mockUsers} />
                    {/* دکمه شناور افزودن کاربر */}
                    <motion.button
                        onClick={() => setInviteUser(true)}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        aria-label="افزودن کاربر"
                        title="افزودن کاربر"

                        className="absolute top-20 right-4 z-40 w-12 h-12 flex items-center justify-center
               rounded-full bg-blue-600 hover:bg-blue-700 text-white
               shadow-lg shadow-blue-600/30 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22" height="22" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                    </motion.button>

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
                        کاربران
                    </button>
                    <button onClick={() => {
                        toast.success("جلسه با موفقیت خاتمه یافت")
                        navigate("/")
                    }} className="bg-red-600 hover:bg-red-700 px-3 py-1 md:px-4 md:py-1 rounded-md font-bold text-sm md:text-base ml-auto md:ml-0">پایان</button>
                    <button
                        onClick={() => setIsMediaTestOpen(true)}
                        className="text-blue-500 p-2 text-sm md:text-base rounded-lg transition hover:bg-[rgb(var(--bg-secondary))]-700"
                    >
                        تست دستگاه
                    </button>
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
            <Modal isOpen={isMediaTestOpen} onClose={() => setIsMediaTestOpen(false)}>
                {deviceType === 'mobile'
                    ? <MobileMediaTester />
                    : <MediaTestEnvironment />
                }
            </Modal>
            <Modal
                isOpen={inviteUser}
                onClose={() => setIsMediaTestOpen(false)}
            >
                <MemberForm
                    onSubmit={handleSubmit}
                    
                />
            </Modal>
        </div>
    );
};

export default Main;
