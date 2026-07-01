import React, { useEffect, useRef, useState } from "react";

import AccessDevice, { type MediaDeviceType } from '../shared/AccessDevice';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import AuthModal from "../AuthModal.js";
import { useUIStore } from "../store/useUIStore.js";
import type { SessionData } from "../hooks/useSessionFlow.js";
import SessionCreationFlow from "../shared/SessionCreationFlow.js";
import api from "../api/api.js";
import toast from "react-hot-toast";

type TypewriterProps = {
  text?: string[];
  delay?: number;
  deleteSpeed?: number;
  loop?: boolean;
  cursor?: string;
  cursorClassName?: string;
  textClassName?: string;
  wrapperClassName?: string;
};

export function Typewriter({
  text = [],
  delay = 50,
  deleteSpeed = 25,
  loop = true,
  cursor = "|",
  cursorClassName = "text-gray-400 font-light",
  textClassName = "",
  wrapperClassName = "text-2xl",
}: TypewriterProps) {
  const [display, setDisplay] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);


  const mounted = useRef<boolean>(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const words = Array.isArray(text) ? text : [String(text)];
    if (!words.length) return;

    const current = words[wordIndex % words.length];

    const isLastCycleNoLoop =
      !loop &&
      wordIndex >= words.length - 1 &&
      !isDeleting &&
      charIndex >= current.length;

    if (isLastCycleNoLoop) {
      setDisplay(current);
      return;
    }

    const humanizeTyping = Math.random() * 30;
    const speed = isDeleting ? deleteSpeed : delay + humanizeTyping;

    if (!isDeleting) {
      if (charIndex <= current.length) {
        timeoutRef.current = setTimeout(() => {
          if (!mounted.current) return;
          setDisplay(current.slice(0, charIndex));
          setCharIndex((c) => c + 1);
        }, speed);
      } else {
        timeoutRef.current = setTimeout(() => {
          if (!mounted.current) return;
          setIsDeleting(true);
          setCharIndex((c) => c - 1);
        }, 2000);
      }
    } else {
      if (charIndex > 0) {
        timeoutRef.current = setTimeout(() => {
          if (!mounted.current) return;
          setDisplay(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        }, speed);
      } else {
        timeoutRef.current = setTimeout(() => {
          if (!mounted.current) return;
          setIsDeleting(false);
          setWordIndex((w) => w + 1);
          setCharIndex(0);
        }, 400);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [charIndex, isDeleting, wordIndex, text, delay, deleteSpeed, loop]);

  const renderDisplayWithSecondBlue = () => {
    const parts = display.split(" ");

    if (parts.length <= 1) {
      return (
        <span className={textClassName} style={{ whiteSpace: "pre" }}>
          {display}
        </span>
      );
    }

    const first = parts[0] || "";
    const second = parts[1] || "";
    const rest = parts.slice(2).join(" ");
    return (
      <span className={`transition-all text-2xl duration-300 ${textClassName}`} style={{ whiteSpace: "pre" }}>
        {first} <span className="text-blue-500 font-medium inline-block">{second}</span>
        {rest ? " " + rest : ""}

      </span>
    );
  };

  return (
    <div className={wrapperClassName} style={{ display: "inline-block" }}>
      {renderDisplayWithSecondBlue()}

      <span
        className={`animate-pulse text-3xl ${cursorClassName} `}
        aria-hidden="true"
        style={{ display: "inline-block", lineHeight: 1 }}
      >
        {cursor}
      </span>
    </div>
  );
}


type RandomImageBackgroundProps = {
  images: string[];
  children?: React.ReactNode;
  overlayClassName?: string;
  // isFocused?: boolean;
};

export function RandomImageBackground({
  images,
  children,
  // isFocused = false,
  overlayClassName = "bg-black/50"
}: RandomImageBackgroundProps) {
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (images && images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentImage(images[randomIndex]);
    }
  }, [images]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {currentImage && (
        <img
          src={currentImage}
          alt="Background"
          className={`absolute top-0 left-0 w-full h-full object-cover z-0 transition duration-1000 blur-none `}
        />
      )}

      <div className={`absolute top-0 left-0 w-full h-full z-10 ${overlayClassName}`}></div>

      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </div>
  );
}
const modules = import.meta.glob(
  "/src/assets/images/background/*.jpg",
  { eager: true, import: "default" }
);
const BACKGROUND_IMAGES = Object.values(modules) as string[];


export default function Dashboard() {
  
  

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);

  const isAuthenticated = useUIStore((s) => s.isAuthenticated);


  const navigate = useNavigate();

  const { isLoading: isAuthLoading, refetch } = useAuth();
  const { withAuthGuard } = useAuth();
  

  const handleSessionFinalSubmit = async (
    data: SessionData,
  
  ) => {
    try {
      const res = await api.post('/session-manager/new-session', {
        ...data,
        emptyTimeout: data.emptyTimeout * 60,
      });

      const meetingId = res.data.meeting.id;

      toast.success("جلسه ساخته شد");
      navigate(`/session/${meetingId}`);
    } catch (error) {
      console.error("خطا", error);
      toast.error("خطا در ساخت جلسه");
    } finally {
      setIsMeetingModalOpen(false);
    }
  };


  const handleAccessSelect = (type: MediaDeviceType) => {
    
    setIsAccessModalOpen(false);
    console.log("سخت‌افزار انتخاب‌شده:", type);
  };

  const handleProtectedMeetingAction = async () => {
    withAuthGuard(() => {
      setIsMeetingModalOpen(true);
    });
    if (isAuthenticated) {
      setIsMeetingModalOpen(true);
      return;
    }

    try {
      const { data } = await refetch();
      if (data) {
        setIsMeetingModalOpen(true);
      } else {

        setIsAuthModalOpen(true);
        // navigate('/login')
      }
    } catch (err) {
      console.error("Authentication check failed", err);
      setIsAuthModalOpen(true);
    }
  };





  return (
    <RandomImageBackground images={BACKGROUND_IMAGES} >
      <SessionCreationFlow
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        onSubmit={handleSessionFinalSubmit}
      />

      <AccessDevice
        isOpen={isAccessModalOpen}
        onSelect={handleAccessSelect}
        onClose={() => setIsAccessModalOpen(false)}
      />
      {!isAuthenticated && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            setIsMeetingModalOpen(true);
          }}
        />
      )}
      <div dir="rtl" className="flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          <Typewriter
            text={[
              "امکان مدیریت جلسات",
              'ایجاد جلسات با بهترین کیفیت',
              'امکان ایجاد لینک خصوصی',
              'ارسال لینک جلسه از طریق پیامک'
            ]}
            delay={50}
            deleteSpeed={30}
            loop={true}
            cursor="|"
            cursorClassName="text-blue-500 font-light"
            textClassName="text-white"
          />
        </h1>

        <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-2xl">
          درصورت به همراه داشتن لینک جلسه آن را قرار دهید و روی{" "}
          <span className="inline-block px-2  border-2 border-blue-400 rounded-md text-blue-400 font-medium">
            پیوستن به جلسه
          </span>{" "}
          کلیک نمایید ، در غیر اینصورت بر روی ساخت جلسه کلیک نمایید
        </p>


        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* <div className=" md:col-span-2">
            <Input
              name="name"
              placeholder="کد جلسه را وارد کنید"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onFocusChange={(status) => setIsFocused(status)}
              autoComplete="off"
            />
          </div> */}

          {/* <NavLink
            to="/login"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 flex-row-reverse"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 9.75v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>

            <span className="text-nowrap">پیوستن به جلسه</span>
          </NavLink> */}

          {/* 
          <button
            onClick={handleMeetingSetup}
            disabled={isProcessing}
            className={`w-full text-center px-6 py-3 bg-transparent border cursor-pointer border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? 'در حال بررسی سخت‌افزار...' : 'انتخاب نوع جلسه'}

          </button> */}
          {/* <button
            onClick={() => { setIsMeetingModalOpen(true) }}
            className="w-full text-center px-6 py-3 bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white rounded-lg font-medium transition-colors duration-200 text-sm md:text-base"
          >
            انتخاب نوع جلسه
          </button> */}
          <button
            onClick={handleProtectedMeetingAction}
            disabled={isAuthLoading}
            className={`w-full text-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium transition-colors duration-200 text-sm md:text-base 
              ${isAuthLoading ? 'opacity-50 cursor-wait' : 'hover:bg-white hover:text-gray-900'}`}
          >
            {isAuthLoading ? 'در حال بررسی...' : 'ساخت جلسه'}
          </button>

          {/* <NavLink
            to="/register"
            className="w-full text-center px-6 py-3 bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white rounded-lg font-medium transition-colors duration-200"
          >
            ساخت جلسه
          </NavLink> */}
        </div>
      </div>
    </RandomImageBackground>
  );
}
