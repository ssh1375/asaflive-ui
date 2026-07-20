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
  LocalParticipant,
  VideoPresets
} from 'livekit-client';
import Modal from '../../shared/Modal.js';
import { MemberForm } from '../../shared/MemberForm.js';
import VideoPlayer from './VideoPlayer.js';
import { AudioPlayer } from './AudioPlayer.js';
import { Participant } from 'livekit-client';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api from '../../api/api.js';

interface User {
  id: string;
  name: string;

  hasVideo: boolean;
  videoTrack?: Track | MediaStreamTrack | null;

  hasAudio: boolean;
  audioTrack?: Track | MediaStreamTrack | null;

  isMuted: boolean;
  isSpeaking: boolean;
}
interface VideoDeviceWithQuality {
  device: MediaDeviceInfo;
  quality: 'عالی' | 'خوب' | 'معمولی';
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
  const location = useLocation();

  const roomRef = useRef<Room | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteUser, setInviteUser] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [copyLink, setCopyLink] = useState("");

  const [searchParams] = useSearchParams();
  const egressId = searchParams.get("egressId");
  const isGuest = location.pathname.includes('guest');
 
  
  const navigate = useNavigate();

  


  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const [videoDevices, setVideoDevices] = useState<VideoDeviceWithQuality[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>('');
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  const [expandedUser, setExpandedUser] = useState<User | null>(null);

  const { egress } = location.state || {};
  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const checkEgressStatus = useCallback(async () => {
    const res = await api.get(`/session-manager/meeting/${egressId}`);
    if (res.data === false) toast.error('ضبط متوقف شده است.');
  }, [egressId]);
  useEffect(() => {
    if (!egressId && isGuest) return;
    checkEgressStatus();
    const id = setInterval(checkEgressStatus, 10000);
    return () => {clearInterval(id)};
  }, []);

  useEffect(() => {
    if (!egress && !isGuest) {
      setError("جلسه ضبط نمی شود");
      toast.error("خطا در ضبط جلسه رخ داده است");
    } else {
      toast.success("جلسه در حال ضبط است")
    }
  }, [egress]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedUser(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const enumerateOnly = async () => {
      try {
        const devices = await Room.getLocalDevices('videoinput');
        setVideoDevices(devices.map(device => ({ device, quality: 'معمولی' })));
        if (devices.length > 0 && !currentDeviceId) {
          setCurrentDeviceId(devices[0].deviceId);
        }
      } catch (err) {
        console.error(err);
      }
    };

    enumerateOnly();
    navigator.mediaDevices.addEventListener('devicechange', enumerateOnly);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', enumerateOnly);
    };
  }, [currentDeviceId]);

  // const handleSwitchCamera = async () => {
  //   const room = roomRef.current;

  //   // اگر رومی وجود ندارد، یا در حال سوئیچ هستیم، یا فقط یک دوربین داریم، کاری نکن
  //   if (!room || isSwitching || videoDevices.length <= 1) return;

  //   setIsSwitching(true);

  //   try {
  //     // پیدا کردن ایندکس دوربین فعلی
  //     const currentIndex = videoDevices.findIndex(d => d.deviceId === currentDeviceId);

  //     // محاسبه ایندکس دوربین بعدی (اگر به آخر لیست رسیدیم، برگرد به اولی)
  //     const nextIndex = (currentIndex + 1) % videoDevices.length;
  //     const nextDevice = videoDevices[nextIndex];

  //     // سوئیچ کردن دوربین از طریق API داخلی LiveKit
  //     await room.switchActiveDevice('videoinput', nextDevice.deviceId);

  //     // آپدیت کردن استیت با ID دوربین جدید
  //     setCurrentDeviceId(nextDevice.deviceId);
  //     console.log(`دوربین با موفقیت به ${nextDevice.label || 'دستگاه جدید'} تغییر یافت.`);

  //   } catch (error) {
  //     console.error("خطا در هنگام جابه‌جایی دوربین:", error);
  //     alert("مشکلی در تغییر دوربین پیش آمد.");
  //   } finally {
  //     setIsSwitching(false);
  //   }
  // };

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

    const participants: Participant[] = [
      room.localParticipant,
      ...Array.from(room.remoteParticipants.values())
    ];

    const allUsers: User[] = participants.map((p) => {
      const cameraPub = p.getTrackPublication(Track.Source.Camera);
      const micPub = p.getTrackPublication(Track.Source.Microphone);

      const isCameraActive = cameraPub && cameraPub.track && !cameraPub.isMuted;
      const isMicActive = micPub && micPub.track && !micPub.isMuted;

      return {
        id: p.identity,
        name: p.name || p.identity,

        participant: p,
        isLocalUser: p instanceof LocalParticipant,

        videoTrack: isCameraActive ? cameraPub.track : undefined,
        hasVideo: !!isCameraActive,

        audioTrack: isMicActive ? micPub.track : undefined,
        hasAudio: !!isMicActive,
        isMuted: !isMicActive,

        isSpeaking: p.isSpeaking,
      };
    });

    setUsers(allUsers);
  }, []);

  const handleSelectCamera = async (deviceId: string) => {
    const room = roomRef.current;

    if (!room || isSwitching || deviceId === currentDeviceId) return;

    setIsSwitching(true);

    try {
      await room.switchActiveDevice('videoinput', deviceId);

      setCurrentDeviceId(deviceId);
      console.log(`دوربین با موفقیت به دستگاه جدید تغییر یافت.`);
    } catch (error) {
      console.error("خطا در هنگام جابه‌جایی دوربین:", error);
      toast.error("مشکلی در تغییر دوربین پیش آمد.");
    } finally {
      setIsSwitching(false);
    }
  };


  const attachTrack = useCallback((track: Track | MediaStreamTrack, participantId: string) => {
    const container = document.getElementById(`video-container-${participantId}`);
    if (!container) {
      console.warn(`⚠️ کانتینر ${participantId} پیدا نشد`);
      return;
    }

    let element: HTMLVideoElement | HTMLAudioElement;
    if (track instanceof Track) {
      element = track.attach();
      if (track.kind === 'video') {
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.objectFit = 'cover';
      }
      console.log(`✅ ${track.kind === 'video' ? 'ویدیو' : 'صدا'} ${participantId} متصل شد (LiveKit Track)`);
    } else {
      if (track.kind === 'video') {
        element = document.createElement('video');
        (element as HTMLVideoElement).srcObject = new MediaStream([track]);
        (element as HTMLVideoElement).autoplay = true;
        (element as HTMLVideoElement).playsInline = true;
        (element as HTMLVideoElement).muted = false;
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.objectFit = 'cover';
      } else {
        element = document.createElement('audio');
        (element as HTMLAudioElement).srcObject = new MediaStream([track]);
        (element as HTMLAudioElement).autoplay = true;
      }
      console.log(`✅ ${track.kind === 'video' ? 'ویدیو' : 'صدا'} ${participantId} متصل شد (MediaStreamTrack)`);
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

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      publishDefaults: {
        simulcast: true,
        videoSimulcastLayers: [
          VideoPresets.h1080,
          VideoPresets.h720,
          VideoPresets.h360,
        ],
      },
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
    });
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
          // resolution: { width: 640, height: 480 }
          resolution: VideoPresets.h720.resolution
        });
        console.log('✅ Camera OK');
        setIsCameraOff(false);
      } catch (e: any) {
        console.error('❌ Camera failed:', e.name, e.message);
        setIsCameraOff(true);

        // تلاش دوم با کیفیت پایین‌تر
        try {
          await room.localParticipant.setCameraEnabled(true, {
            // resolution: { width: 320, height: 240 }
            resolution: VideoPresets.h540.resolution,

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

  useEffect(() => {
    const room = roomRef.current;
    if (!room || isCameraOff) return;
    const pub = room.localParticipant.videoTrackPublications.values().next().value;
    if (pub?.track) {
      attachTrack(pub.track, room.localParticipant.identity);
    }
  }, [isCameraOff, attachTrack]);
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
    navigate('/')
  };

  const handleSubmit = () => {
    setInviteUser(false);
  };
  return (
    <div className="vc-root">

      {/* Main Video Area */}
      <div className="vc-main">

        {/* Status Bar */}
        <div className="vc-statusbar">
          <div className="vc-statusbar-left">
            <div
              className="vc-dot"
              style={{
                background: connected ? '#22c55e' : '#ef4444',
                animation: connected ? 'pulse 2s infinite' : 'none',
              }}
            />
            <span className="vc-status-text">
              {connected ? 'متصل' : 'قطع شده'}
            </span>
          </div>

          <div className="vc-statusbar-actions ">
            <button
              onClick={toggleMute}
              className="vc-action-btn"
              style={{ background: isMuted ? '#ef4444' : '#3f3f46' }}
            >
              {isMuted ? '🔇 میکروفون خاموش' : '🎤 میکروفون روشن'}
            </button>
            <button
              onClick={toggleCamera}
              className="vc-action-btn"
              style={{ background: isCameraOff ? '#ef4444' : '#3f3f46' }}
            >
              {isCameraOff ? '📷 دوربین خاموش' : '📹 دوربین روشن'}
            </button>

            {videoDevices.length > 0 && (
              <div className="relative min-w-[200px]">
                <select
                  value={currentDeviceId}
                  onChange={(e) => handleSelectCamera(e.target.value)}
                  disabled={isSwitching}
                  className="w-full px-3 py-2 pr-8 bg-zinc-800 text-zinc-100 border  border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait appearance-none"
                >
                  {videoDevices.map(({ device, quality }) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `دوربین ${device.deviceId.slice(0, 4)}`} (کیفیت تصویر: {quality})
                    </option>
                  ))}
                </select>

                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-zinc-400 text-xs">
                  ▼
                </div>
                
              </div>
            )}
            <button
              onClick={leaveCall}
              className="vc-action-btn"
              style={{ background: '#dc2626' }}
            >
              🚪 خروج
            </button>
          </div>
        </div>

        {error && (
          <div className="vc-error">{error}</div>
        )}

        {/* User Slider */}
        <div className="vc-slider">
          <button
            onClick={() => slide('left')}
            className="vc-slide-btn vc-slide-left"
            style={{
              opacity: canLeft ? 1 : 0,
              pointerEvents: canLeft ? 'auto' : 'none',
            }}
          >
            ←
          </button>

          <div
            ref={scrollRef}
            onScroll={updateArrows}
            className="vc-slider-track"
          >
            {users.map((user) => {
              const isLocalUser = roomRef.current?.localParticipant.identity === user.id;

              return (
                <div
                  key={user.id}
                  className="vc-card"
                  onClick={() => setExpandedUser(user)}
                  style={{
                    border: user.isSpeaking ? '2px solid #4ade80' : '1px solid #3f3f46',
                    boxShadow: user.isSpeaking
                      ? '0 0 0 3px rgba(74,222,128,0.3), 0 0 20px rgba(74,222,128,0.2)'
                      : 'none',
                  }}
                >
                  {user.isSpeaking && (
                    <div className="vc-speaking-overlay" />
                  )}

                  {user.hasVideo && user.videoTrack ? (
                    <VideoPlayer track={user.videoTrack} participantId={user.id} />
                  ) : (
                    <div className="vc-avatar-fallback">
                      <span className="vc-avatar-letter">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {!isLocalUser && user.audioTrack && user.hasAudio && (
                    <AudioPlayer track={user.audioTrack} />
                  )}

                  <div className="vc-card-footer">
                    <span className="vc-card-name">{user.name}</span>
                    {user.isMuted ? (
                      <span style={{ color: '#f87171', fontSize: '12px' }}>🔇</span>
                    ) : (
                      <span style={{ color: '#4ade80', fontSize: '12px', animation: 'pulse 1s infinite' }}>🎤</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => slide('right')}
            className="vc-slide-btn vc-slide-right"
            style={{
              opacity: canRight ? 1 : 0,
              pointerEvents: canRight ? 'auto' : 'none',
            }}
          >
            →
          </button>
        </div>
        {expandedUser && (
          <div
            onClick={() => setExpandedUser(null)}
            className="fixed inset-0 z-50 flex items-center justify-center 
                     bg-black/80 backdrop-blur-sm
                     animate-in fade-in duration-200"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative w-[95vw] h-[90vh] max-w-7xl
                       bg-gray-900 rounded-2xl overflow-hidden
                       border border-gray-700 shadow-2xl
                       animate-in zoom-in-95 duration-300"
            >
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10
                            bg-gradient-to-b from-black/80 to-transparent
                            px-6 py-4 flex items-center justify-between">
                <span className="text-xl font-semibold text-white">
                  {expandedUser.name}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    {expandedUser.isSpeaking ? (
                      <>🎤 <span>در حال صحبت</span></>
                    ) : expandedUser.isMuted ? (
                      <>🔇 <span>میکروفون خاموش</span></>
                    ) : (
                      <>🟢 <span>آنلاین</span></>
                    )}
                  </span>

                  <button
                    onClick={() => setExpandedUser(null)}
                    className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30
                             text-red-400 hover:text-red-300
                             transition-colors duration-200
                             flex items-center justify-center text-xl font-light"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Video Container */}
              <div className="w-full h-full flex items-center justify-center bg-gray-950">
                {expandedUser.hasVideo && expandedUser.videoTrack ? (
                  <VideoPlayer
                    track={expandedUser.videoTrack}
                    participantId={`${expandedUser.id}-expanded`}
                  // className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
                                  flex items-center justify-center text-white text-5xl font-bold
                                  shadow-2xl shadow-blue-500/50">
                      {expandedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-400 text-lg">دوربین خاموش است</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* User List Sidebar */}
      <div className="vc-sidebar">
        <div className="vc-sidebar-header">
          <h2 className="vc-sidebar-title">لیست کاربران</h2>
          <button onClick={() => setInviteUser(true)} className="vc-invite-btn">
            افزودن کاربر+
          </button>
        </div>

        <div className="vc-sidebar-list">
          {users.map((user, _) => {
            const isActive = selectedUser?.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="vc-user-item"
                style={{
                  border: isActive ? '1px solid #3b82f6' : '1px solid #3f3f46',
                  background: isActive ? 'rgba(37,99,235,0.2)' : '#27272a',
                  color: isActive ? '#93c5fd' : '#e4e4e7',
                }}
              >
                <div className="vc-user-item-inner">
                  <div style={{ minWidth: 0 }}>
                    <div className="vc-user-name">{user.name}</div>
                    <div className="vc-user-status">
                      {user.isSpeaking ? 'در حال صحبت' : user.isMuted ? 'میکروفون خاموش' : 'آنلاین'}
                    </div>
                  </div>

                  <div className="vc-user-avatar-wrap">
                    <div className="vc-user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <span
                      className="vc-user-badge"
                      style={{ background: user.isSpeaking ? '#4ade80' : '#71717a' }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Modal isOpen={inviteUser} onClose={() => setInviteUser(false)}>
        <MemberForm onSubmit={handleSubmit} onClose={() => setInviteUser(false)} setShowLink={setShowLink} setCopyLink={setCopyLink} />
      </Modal>
      <Modal isOpen={showLink} onClose={() => setShowLink(false)}>
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl p-8 w-full max-w-lg mx-auto shadow-2xl border border-zinc-700/50">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center text-zinc-100 mb-6">
              لینک دعوت
            </h3>

            <div className="relative group">
              <input
                type="text"
                value={copyLink}
                readOnly
                className="w-full px-4 py-3.5 pl-14 bg-zinc-950/60 border border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer select-all"
                onClick={(e) => e.currentTarget.select()}
              />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(copyLink);
                  toast.success("لینک با موفقیت کپی شد")
                  setShowLink(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 group-hover:scale-105"
                title="کپی لینک"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            <p className="text-xs text-zinc-500 text-center mt-3">
              کلیک روی دکمه برای کپی و بستن خودکار
            </p>
          </div>
        </div>

      </Modal>

      <style>{`
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    div::-webkit-scrollbar { width: 0; height: 0; }

    .vc-root {
      width: 100%;
      height: 100vh;
      display: flex;
      background: #09090b;
      color: #fff;
      font-family: sans-serif;
    }

    .vc-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px;
      gap: 16px;
      min-width: 0;
    }

    .vc-statusbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #18181b;
      border-radius: 12px;
      border: 1px solid #27272a;
      flex-wrap: wrap;
      gap: 10px;
    }
    .vc-statusbar-left { display: flex; align-items: center; gap: 8px; }
    .vc-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .vc-status-text { font-size: 14px; color: #a1a1aa; white-space: nowrap; }

    .vc-statusbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .vc-action-btn {
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .vc-error {
      padding: 12px;
      background: #7f1d1d;
      border: 1px solid #991b1b;
      border-radius: 8px;
      font-size: 14px;
    }

    .vc-slider {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vc-slide-btn {
      position: absolute;
      z-index: 10;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(24,24,27,0.9);
      border: 1px solid #52525b;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .vc-slide-left { left: 4px; }
    .vc-slide-right { right: 4px; }

    .vc-slider-track {
      width: 100%;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding: 8px 4px;
      scrollbar-width: none;
    }

    .vc-card {
      position: relative;
      flex-shrink: 0;
      scroll-snap-align: center;
      border-radius: 12px;
      overflow: hidden;
      width: 560px;
      height: 315px;
      transition: all 0.3s;
      cursor: pointer;
      background: #18181b;
    }

    .vc-speaking-overlay {
      position: absolute;
      inset: 0;
      border-radius: 12px;
      background: rgba(74,222,128,0.05);
      z-index: 10;
      pointer-events: none;
      animation: pulse 1s infinite;
    }

    .vc-avatar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    }
    .vc-avatar-letter { color: #fff; font-size: 32px; font-weight: bold; }

    .vc-card-footer {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent);
      padding: 16px 6px 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      z-index: 20;
    }
    .vc-card-name {
      color: #fff;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      text-align: right;
    }

    .vc-sidebar {
      width: 280px;
      background: #18181b;
      border-left: 1px solid #27272a;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex-shrink: 0;
    }
    .vc-sidebar-header { display: flex; align-items: center; justify-content: space-between; }
    .vc-sidebar-title { color: #e4e4e7; font-weight: bold; font-size: 14px; }
    .vc-invite-btn {
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 8px;
      border: none;
      background: #2563eb;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .vc-sidebar-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;
    }

    .vc-user-item {
      width: 100%;
      text-align: right;
      padding: 12px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .vc-user-item-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .vc-user-name {
      font-weight: 500;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .vc-user-status { font-size: 12px; color: #a1a1aa; margin-top: 4px; }

    .vc-user-avatar-wrap { position: relative; flex-shrink: 0; }
    .vc-user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(37,99,235,0.2);
      border: 1px solid rgba(59,130,246,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #93c5fd;
      font-weight: bold;
      font-size: 14px;
    }
    .vc-user-badge {
      position: absolute;
      bottom: 0; right: 0;
      width: 10px; height: 10px;
      border-radius: 50%;
      border: 2px solid #18181b;
    }

    /* ----------- Responsive ----------- */

    @media (max-width: 1200px) {
      .vc-card { width: 420px; height: 420px; }
    }

    @media (max-width: 1024px) {
      .vc-card { width: 340px; height: 340px; }
      .vc-sidebar { width: 220px; }
    }

    @media (max-width: 768px) {
      .vc-root { flex-direction: column; height: auto; min-height: 100vh; }
      .vc-main { padding: 10px; gap: 10px; order: 1; }
      .vc-sidebar {
        width: 100%;
        border-left: none;
        border-top: 1px solid #27272a;
        order: 2;
        max-height: 280px;
      }
      .vc-statusbar { padding: 10px; }
      .vc-statusbar-actions { width: 100%; justify-content: space-between; }
      .vc-action-btn { flex: 1; padding: 8px 6px; font-size: 11px; text-align: center; }
      .vc-status-text { font-size: 12px; }

      .vc-card { width: 80vw; height: 80vw; max-width: 380px; max-height: 380px; }
      .vc-slide-btn { width: 24px; height: 24px; }
    }

    @media (max-width: 420px) {
      .vc-card { width: 88vw; height: 88vw; }
      .vc-action-btn { font-size: 10px; padding: 8px 4px; }
      .vc-sidebar { max-height: 220px; }
    }
  `}</style>

    </div>

  );
};

export default Main;

