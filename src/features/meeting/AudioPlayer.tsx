import React, { useEffect, useRef } from 'react';
import { Track } from 'livekit-client';

interface AudioPlayerProps {
  track?: Track | MediaStreamTrack | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ track }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !track) return;

    let element: HTMLMediaElement | null = null;

    if (track instanceof Track) {
      // LiveKit خودش تگ <audio> می سازد
      element = track.attach();
    } else {
      element = document.createElement('audio');
      element.autoplay = true;
      // برای جلوگیری از خطاهای احتمالی، صدا در ابتدا Mute نیست
      element.muted = false; 
      element.srcObject = new MediaStream([track]);
    }

    container.appendChild(element);

    return () => {
      if (track instanceof Track && element) {
        track.detach(element);
      } else if (element) {
        element.srcObject = null;
        element.remove();
      }
    };
  }, [track]);

  // یک دیو کاملاً مخفی که صرفاً نگهدارنده تگ صوتی است
  return <div ref={containerRef} style={{ display: 'none' }} aria-hidden="true" />;
};
