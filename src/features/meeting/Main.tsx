// import React, { useEffect, useRef, useState } from 'react';
// import LiveMonitor from './LiveMonitor';
// import Chat from '../chat/Chat';
// import UserSlider from '../lobby/UserSlider';
// import type { User } from '../lobby/UserSlider';
// import { ThemeSwitcher } from '../theme/ThemeSwitcher';
// import ChatPage from '../chat/ChatPage';
// import { useChatStore } from '../controls/ChatStore';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useMediaQuery } from '../../hooks/useMediaQuery.js';
// import { initFakeBackend } from '../../services/FakeBackend.js';
// import MediaTestEnvironment from '../lobby/MediaTester.js';
// import Modal from '../../shared/Modal.js';
// import { useDeviceType } from '../../hooks/useDeviceType.js';
// import MobileMediaTester from '../lobby/MobileMediaTester.js';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { MemberForm, type MemberFormData } from '../../shared/MemberForm.js';
// import LiveKitMeeting from './hey.js';

// const Main: React.FC = () => {
//     const { isChatOpen, toggleChat } = useChatStore();
//     const setUsers = useChatStore(state => state.setUsers);
//     const setCurrentUser = useChatStore(state => state.setCurrentUser);
//     const initSocket = useChatStore(state => state.initSocket);

//     const [isMediaTestOpen, setIsMediaTestOpen] = useState(false);
//     const deviceType = useDeviceType();
//     const isDesktop = useMediaQuery('(min-width: 768px)');
//     const navigate = useNavigate();
//     const [inviteUser, setInviteUser] = useState(false);

//     const videoMapRef = useRef<Map<string, HTMLVideoElement>>(new Map());

    
//     const [liveKitUsers, setLiveKitUsers] = useState<User[]>([]);

//     useEffect(() => {
//         initFakeBackend();
//         initSocket();
//     }, [initSocket]);

//     useEffect(() => {
//         setUsers([]);
//         setCurrentUser('local');
//     }, []);

//     useEffect(() => setIsMediaTestOpen(true), []);

//     const handleSubmit = (data: MemberFormData) => {
//         setInviteUser(false);
//     };

//     return (
//         <div className="flex h-screen w-full bg-[rgb(var(--bg))] text-[rgb(var(--bg))] overflow-hidden font-sans relative">
            
//             {/* ✅ LiveKitMeeting لیست کاربران را به Main پاس می‌دهد */}
//             {/* <LiveKitMeeting onUsersUpdate={setLiveKitUsers} /> */}
//             <LiveKitMeeting onUsersUpdate={setLiveKitUsers} videoElementsMap={videoMapRef} />


//             <main className="flex-1 relative flex flex-col bg-[rgb(var(--bg-secondary))]-900 w-full overflow-hidden">

//                 <div className="w-full bg-[rgb(var(--bg))]/20 backdrop-blur-sm px-1">
//                     {/* <UserSlider users={liveKitUsers} /> */}
//                     <UserSlider users={liveKitUsers} videoElementsMap={videoMapRef} />
//                 </div>

//                 <div className="flex-1 relative bottom-5 w-full h-20 md:pb-0 flex items-center justify-center overflow-hidden">
//                     <div className="relative w-full max-w-[125vh] aspect-video bg-[rgb(var(--bg))] rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
//                         <video
//                             className="w-full h-full object-cover"
//                             autoPlay
//                             muted
//                             loop
//                             playsInline
//                         />
                        
//                         <LiveMonitor
//                             locationName="Tehran, Iran"
//                             coordinates="35.6892° N, 51.3890° E"
//                             watermark="MY_BRAND_LIVE"
//                         />
//                     </div>
//                 </div>

//                 <div className="absolute bottom-0 w-full h-16 bg-[rgb(var(--bg-secondary))]-800/90 backdrop-blur-md flex items-center justify-center gap-2 sm:gap-4 md:gap-6 border-t border-zinc-700 px-2 z-30">
//                     <button className="text-blue-500 p-2 text-sm md:text-base rounded-lg transition">سکوت</button>
//                     <button className="text-blue-500 p-2 text-sm md:text-base rounded-lg transition hidden sm:block">توقف</button>
//                     <button
//                         onClick={toggleChat}
//                         className={`p-2 text-sm text-blue-600 md:text-base rounded-lg transition ${isChatOpen ? 'bg-blue-400' : 'hover:bg-[rgb(var(--bg-secondary))]-700'}`}
//                     >
//                         کاربران
//                     </button>
//                     <button 
//                         onClick={() => {
//                             toast.success("جلسه با موفقیت خاتمه یافت");
//                             navigate("/");
//                         }} 
//                         className="bg-red-600 hover:bg-red-700 px-3 py-1 md:px-4 md:py-1 rounded-md font-bold text-sm md:text-base ml-auto md:ml-0"
//                     >
//                         پایان
//                     </button>
//                     <button
//                         onClick={() => setIsMediaTestOpen(true)}
//                         className="text-blue-500 p-2 text-sm md:text-base rounded-lg transition hover:bg-[rgb(var(--bg-secondary))]-700"
//                     >
//                         تست دستگاه
//                     </button>
//                 </div>
//             </main>

//             <AnimatePresence>
//                 {isChatOpen && (
//                     <motion.aside
//                         initial={{
//                             opacity: 0,
//                             x: isDesktop ? '100%' : 0,
//                             y: !isDesktop ? '100%' : 0,
//                             scale: 1,
//                             filter: 'blur(9px)',
//                         }}
//                         animate={{
//                             opacity: 1,
//                             x: 0,
//                             y: 0,
//                             scale: 1,
//                             filter: 'blur(0px)',
//                         }}
//                         exit={{
//                             opacity: 0,
//                             x: isDesktop ? '110%' : 0,
//                             y: !isDesktop ? '110%' : 0,
//                             scale: 0.95,
//                             filter: 'blur(9px)',
//                         }}
//                         transition={{
//                             type: 'spring',
//                             stiffness: 300,
//                             damping: 25,
//                             mass: 0.8,
//                         }}
//                         style={{
//                             transformOrigin: isDesktop ? "right center" : "bottom center"
//                         }}
//                         className="absolute inset-0 md:relative z-50 md:z-auto w-full sm:w-80 md:w-96 h-full bg-zinc-800 border-l border-zinc-700 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.3)] md:shadow-none"
//                     >
//                         <div className="flex-1 overflow-y-auto">
//                             <ChatPage 
//                                 users={liveKitUsers} 
//                                 onSubmit={handleSubmit}
//                                 inviteUser={inviteUser}
//                                 setInviteUser={setInviteUser} 
//                             />
//                         </div>
//                     </motion.aside>
//                 )}
//             </AnimatePresence>

//             <Modal isOpen={isMediaTestOpen} onClose={() => setIsMediaTestOpen(false)}>
//                 {deviceType === 'mobile'
//                     ? <MobileMediaTester />
//                     : <MediaTestEnvironment />
//                 }
//             </Modal>

//             <Modal isOpen={inviteUser} onClose={() => setInviteUser(false)}>
//                 <MemberForm onSubmit={handleSubmit} onClose={() => setInviteUser(false)} />
//             </Modal>
//         </div>
//     );
// };

// export default Main;



import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  RemoteTrack,
  RemoteParticipant,
} from 'livekit-client';
import Modal from '../../shared/Modal.js';
import { MemberForm } from '../../shared/MemberForm.js';

interface User {
  id: string;
  name: string;
  hasVideo: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
}

// const AVATAR_COLORS = [
//   'from-indigo-600 to-indigo-800',
//   'from-cyan-600 to-cyan-800',
//   'from-emerald-600 to-emerald-800',
//   'from-amber-600 to-amber-800',
//   'from-pink-600 to-pink-800',
//   'from-violet-600 to-violet-800',
// ];

const Main: React.FC = () => {
  const roomRef = useRef<Room | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteUser, setInviteUser] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
  }, [users, updateArrows]);

  const slide = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' });
    setTimeout(updateArrows, 350);
  };

  const buildUserList = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;

    const allUsers: User[] = [];

    if (room.localParticipant) {
      const lp = room.localParticipant;
      allUsers.push({
        id: lp.identity,
        name: lp.name || lp.identity,
        hasVideo: Array.from(lp.videoTrackPublications.values()).some(
          (pub) => pub.track && !pub.isMuted
        ),
        isMuted: Array.from(lp.audioTrackPublications.values()).every(
          (pub) => !pub.track || pub.isMuted
        ),
        isSpeaking: lp.isSpeaking,
      });
    }

    room.remoteParticipants.forEach((rp) => {
      allUsers.push({
        id: rp.identity,
        name: rp.name || rp.identity,
        hasVideo: Array.from(rp.videoTrackPublications.values()).some(
          (pub) => pub.track && !pub.isMuted
        ),
        isMuted: Array.from(rp.audioTrackPublications.values()).every(
          (pub) => !pub.track || pub.isMuted
        ),
        isSpeaking: rp.isSpeaking,
      });
    });

    setUsers(allUsers);
  }, []);

  const attachTrack = useCallback((track: RemoteTrack | MediaStreamTrack, participantId: string) => {
    const container = document.getElementById(`video-container-${participantId}`);
    if (!container) {
      console.warn(`⚠️ کانتینر ${participantId} پیدا نشد`);
      return;
    }

    let element: HTMLVideoElement | HTMLAudioElement;
    if (track.kind === 'video') {
      element = track instanceof RemoteTrack ? track.attach() : document.createElement('video');
      if (!(track instanceof RemoteTrack) && track instanceof MediaStreamTrack) {
        (element as HTMLVideoElement).srcObject = new MediaStream([track]);
        (element as HTMLVideoElement).autoplay = true;
        (element as HTMLVideoElement).playsInline = true;
        (element as HTMLVideoElement).muted = false;
      }
      element.style.width = '100%';
      element.style.height = '100%';
      element.style.objectFit = 'cover';
      console.log(`✅ ویدیو ${participantId} متصل شد`);
    } else {
      element = track instanceof RemoteTrack ? track.attach() : document.createElement('audio');
      if (!(track instanceof RemoteTrack) && track instanceof MediaStreamTrack) {
        (element as HTMLAudioElement).srcObject = new MediaStream([track]);
        (element as HTMLAudioElement).autoplay = true;
      }
      console.log(`✅ صدای ${participantId} متصل شد`);
    }

    container.innerHTML = '';
    container.appendChild(element);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const url = 'wss://asaflive.ir';

    if (!token) {
      setError('توکن یافت نشد. لطفاً URL را با ?token=YOUR_TOKEN باز کنید');
      return;
    }

    const room = new Room();
    roomRef.current = room;

   room.on(RoomEvent.Connected, async () => {
  console.log('Connected to room');
  setConnected(true);

  // ✅ صبر تا Room کاملاً ready بشه
  await new Promise(resolve => setTimeout(resolve, 500));

  // فعال‌سازی با Try-Catch جداگانه
  try {
    await room.localParticipant.setMicrophoneEnabled(true);
    console.log('✅ Mic OK');
    setIsMuted(false);
  } catch (e: any) {
    console.error('❌ Mic failed:', e.message);
    setIsMuted(true);
  }

  // دوربین با تأخیر بیشتر
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // اجبار به رزولوشن پایین
    await room.localParticipant.setCameraEnabled(true, {
      resolution: { width: 640, height: 480 }
    });
    console.log('✅ Camera OK');
    setIsCameraOff(false);
  } catch (e: any) {
    console.error('❌ Camera failed:', e.name, e.message);
    setIsCameraOff(true);
    
    // تلاش دوم با کیفیت پایین‌تر
    try {
      await room.localParticipant.setCameraEnabled(true, {
        resolution: { width: 320, height: 240 }
      });
      console.log('✅ Camera OK (low res)');
      setIsCameraOff(false);
    } catch (e2: any) {
      console.error('❌ Camera totally failed');
      setError('دوربین غیرفعال است');
    }
  }

  buildUserList();
});


    room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub, participant: RemoteParticipant) => {
      console.log(`📥 Track دریافت شد از ${participant.identity}:`, track.kind);
      if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
        setTimeout(() => {
          attachTrack(track, participant.identity);
        }, 50);
      }
      buildUserList();
    });

    room.on(RoomEvent.TrackUnsubscribed, (_track, _pub, participant: RemoteParticipant) => {
      console.log(`📤 Track قطع شد از ${participant.identity}`);
      const container = document.getElementById(`video-container-${participant.identity}`);
      if (container) container.innerHTML = '';
      buildUserList();
    });

    room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log(`👤 کاربر جدید: ${participant.identity}`);
      buildUserList();
    });

    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log(`👋 کاربر خارج شد: ${participant.identity}`);
      buildUserList();
    });

    room.on(RoomEvent.TrackMuted, buildUserList);
    room.on(RoomEvent.TrackUnmuted, buildUserList);
    room.on(RoomEvent.ActiveSpeakersChanged, buildUserList);

    room.on(RoomEvent.Disconnected, () => {
      console.log('🔴 اتصال قطع شد');
      setConnected(false);
      setError('ارتباط قطع شد');
    });

    console.log(`🔗 در حال اتصال به ${url}...`);
    room
      .connect(url, token)
      .catch((err) => {
        console.error('❌ خطا در اتصال به room:', err);
        setError(`خطا در اتصال: ${err.message}`);
      });

    return () => {
      console.log('🧹 cleanup: قطع اتصال');
      room.disconnect();
    };
  }, [buildUserList, attachTrack]);

  // ✅ اصلاح شده
  const toggleMute = async () => {
    const room = roomRef.current;
    if (!room) return;
    
    const newMuteState = !isMuted;
    await room.localParticipant.setMicrophoneEnabled(!newMuteState);
    setIsMuted(newMuteState);
    console.log(`🎤 میکروفون: ${newMuteState ? 'خاموش' : 'روشن'}`);
  };

  // ✅ اصلاح شده
  const toggleCamera = async () => {
    const room = roomRef.current;
    if (!room) return;

    const newCameraState = !isCameraOff;
    await room.localParticipant.setCameraEnabled(!newCameraState);
    setIsCameraOff(newCameraState);
    console.log(`📹 دوربین: ${newCameraState ? 'خاموش' : 'روشن'}`);
    
    setTimeout(buildUserList, 100);
  };

  const leaveCall = () => {
    roomRef.current?.disconnect();
    window.location.href = '/';
  };

  const handleSubmit = () => {
        setInviteUser(false);
    };
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', background: '#09090b', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* Main Video Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '16px' }}>
        
        {/* Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#18181b', borderRadius: '12px', border: '1px solid #27272a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: connected ? '#22c55e' : '#ef4444',
                animation: connected ? 'pulse 2s infinite' : 'none',
              }}
            />
            <span style={{ fontSize: '14px', color: '#a1a1aa' }}>
              {connected ? 'متصل' : 'قطع شده'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={toggleMute}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isMuted ? '#ef4444' : '#3f3f46',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
            >
              {isMuted ? '🔇 میکروفون خاموش' : '🎤 میکروفون روشن'}
            </button>
            <button
              onClick={toggleCamera}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isCameraOff ? '#ef4444' : '#3f3f46',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
            >
              {isCameraOff ? '📷 دوربین خاموش' : '📹 دوربین روشن'}
            </button>
            <button
              onClick={leaveCall}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#dc2626',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
            >
              🚪 خروج
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px', background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '8px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* User Slider */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={() => slide('left')}
            style={{
              position: 'absolute',
              left: '4px',
              zIndex: 10,
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(24,24,27,0.9)',
              border: '1px solid #52525b',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: canLeft ? 1 : 0,
              pointerEvents: canLeft ? 'auto' : 'none',
              transition: 'all 0.2s',
            }}
          >
            ←
          </button>

          <div
            ref={scrollRef}
            onScroll={updateArrows}
            style={{
              width: '100%',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '8px 4px',
              scrollbarWidth: 'none',
            }}
          >
            {users.map((user, _) => (
              <div
                key={user.id}
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  width: '176px',
                  height: '112px',
                  border: user.isSpeaking ? '2px solid #4ade80' : '1px solid #3f3f46',
                  boxShadow: user.isSpeaking ? '0 0 0 3px rgba(74,222,128,0.3), 0 0 20px rgba(74,222,128,0.2)' : 'none',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  background: '#18181b',
                }}
              >
                {user.isSpeaking && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '12px',
                      background: 'rgba(74,222,128,0.05)',
                      zIndex: 10,
                      pointerEvents: 'none',
                      animation: 'pulse 1s infinite',
                    }}
                  />
                )}

                {user.hasVideo ? (
                  <div id={`video-container-${user.id}`} style={{ width: '100%', height: '100%', background: '#000' }} />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)`,
                    }}
                  >
                    <span style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
                    paddingTop: '16px',
                    paddingBottom: '4px',
                    paddingLeft: '6px',
                    paddingRight: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '4px',
                    zIndex: 20,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'right' }}>
                    {user.name}
                  </span>
                  {user.isMuted ? (
                    <span style={{ color: '#f87171', fontSize: '12px' }}>🔇</span>
                  ) : (
                    <span style={{ color: '#4ade80', fontSize: '12px', animation: 'pulse 1s infinite' }}>🎤</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => slide('right')}
            style={{
              position: 'absolute',
              right: '4px',
              zIndex: 10,
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(24,24,27,0.9)',
              border: '1px solid #52525b',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: canRight ? 1 : 0,
              pointerEvents: canRight ? 'auto' : 'none',
              transition: 'all 0.2s',
            }}
          >
            →
          </button>
        </div>

      </div>

      {/* User List Sidebar */}
      <div style={{ width: '280px', background: '#18181b', borderLeft: '1px solid #27272a', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: '#e4e4e7', fontWeight: 'bold', fontSize: '14px' }}>لیست کاربران</h2>
          <button
            onClick={() => setInviteUser(true)}
            style={{
              fontSize: '12px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            افزودن کاربر+
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {users.map((user, _) => {
            const isActive = selectedUser?.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{
                  width: '100%',
                  textAlign: 'right',
                  padding: '12px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid #3b82f6' : '1px solid #3f3f46',
                  background: isActive ? 'rgba(37,99,235,0.2)' : '#27272a',
                  color: isActive ? '#93c5fd' : '#e4e4e7',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px' }}>
                      {user.isSpeaking ? 'در حال صحبت' : user.isMuted ? 'میکروفون خاموش' : 'آنلاین'}
                    </div>
                  </div>

                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(37,99,235,0.2)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#93c5fd',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        border: '2px solid #18181b',
                        background: user.isSpeaking ? '#4ade80' : '#71717a',
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

     
       <Modal isOpen={inviteUser} onClose={() => setInviteUser(false)}>
                 <MemberForm onSubmit={handleSubmit} onClose={() => setInviteUser(false)} />
            </Modal>
      

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        div::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
    </div>
  );
};

export default Main;

