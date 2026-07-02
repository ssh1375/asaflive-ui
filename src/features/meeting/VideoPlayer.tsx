import React, { useEffect, useRef } from 'react';
import { Track } from 'livekit-client';

interface VideoPlayerProps {
  track?: Track | MediaStreamTrack | null;
  participantId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ track, participantId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !track) return;

    // تعریف عنصر مدیا با نوع‌داده جامع‌تر
    let element: HTMLMediaElement | null = null;
    const isVideo = track.kind === 'video';

    // ۱. ساخت یا دریافت المان (Video / Audio)
    if (track instanceof Track) {
      // استفاده از متد داخلی LiveKit که استریم را ایمن متصل می‌کند
      element = track.attach();
    } else {
      // ساخت دستی برای استریم‌های خام (Native MediaStreamTrack)
      element = document.createElement(isVideo ? 'video' : 'audio');
      element.autoplay = true;
    //   element.playsInline = true;
      element.muted = false; // دقت کنید: مرورگرها ممکن است Autoplay صدادار را مسدود کنند
      element.srcObject = new MediaStream([track]);
    }

    // ۲. اعمال استایل‌ها فقط برای ویدیو
    if (isVideo && element) {
      element.style.width = '100%';
      element.style.height = '100%';
      element.style.objectFit = 'cover';
    }

    // ۳. اتصال به DOM
    if (element) {
      container.appendChild(element);
    }

    // ۴. تابع پاک‌سازی (Cleanup) ایمن
    return () => {
      // جداسازی اصولی LiveKit Track
      if (track instanceof Track && element) {
        track.detach(element);
      } 
      // آزادسازی منابع مدیا برای MediaStreamTrack خام
      else if (element) {
        element.srcObject = null;
        element.removeAttribute('src');
        element.load(); // مجبور کردن مرورگر به رهاسازی بافر استریم
      }
      
      // حذف ایمن گره از DOM به جای استفاده از innerHTML
      if (container && element && container.contains(element)) {
        container.removeChild(element);
      }
    };
  }, [track, participantId]); // وابستگی‌ها به درستی تنظیم شده‌اند

  // بررسی نوع ترک برای جلوگیری از رندر فضای خالی مشکی برای صدا
  const isAudio = track?.kind === 'audio';

  return (
    <div 
      ref={containerRef} 
      id={`media-container-${participantId}`}
      style={{ 
        width: isAudio ? '0' : '100%', 
        height: isAudio ? '0' : '100%', 
        background: isAudio ? 'transparent' : '#000',
        display: isAudio ? 'none' : 'block', // مخفی کردن کامل کانتینر برای ترک صوتی
        overflow: 'hidden',
        borderRadius: '8px' // اختیاری: برای زیباتر شدن گوشه‌های ویدیو
      }} 
    />
  );
};

export default VideoPlayer;
