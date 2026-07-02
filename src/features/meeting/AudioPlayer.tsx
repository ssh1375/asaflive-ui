import React, { useEffect, useRef } from 'react';
import { Track } from 'livekit-client';

interface AudioPlayerProps {
  track?: Track | MediaStreamTrack | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ track }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !track) {
      console.warn("⚠️ AudioPlayer: کانتینر یا Track صوتی یافت نشد.");
      return;
    }

    console.log("✅ AudioPlayer: یک Track صوتی برای پخش دریافت شد:", track.kind);

    let element: HTMLMediaElement | null = null;

    if (track instanceof Track) {
      element = track.attach();
    } else {
      element = document.createElement('audio');
      element.srcObject = new MediaStream([track]);
    }

    element.autoplay = true;
    element.muted = false; 

    container.appendChild(element);

    element.play().catch((error) => {
      console.error("❌ AudioPlayer: مرورگر اجازه پخش صدا را نداد:", error);
    });

    return () => {
      if (track instanceof Track && element) {
        track.detach(element);
      } else if (element) {
        element.srcObject = null;
        element.remove();
      }
    };
  }, [track]);

  return <div ref={containerRef} style={{ display: 'none' }} aria-hidden="true" />;
};
