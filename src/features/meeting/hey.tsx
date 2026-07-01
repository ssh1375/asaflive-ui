import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Room, RoomEvent, Track, LocalParticipant, RemoteParticipant, LocalTrackPublication, RemoteTrackPublication } from 'livekit-client';
import toast from 'react-hot-toast';
import type { User } from '../lobby/UserSlider';

interface LiveKitMeetingProps {
  onUsersUpdate?: (users: User[]) => void;
  videoElementsMap?: React.MutableRefObject<Map<string, HTMLVideoElement>>;

}
// declare global {
//   interface Window {
//     __videoElementsMap?: Map<string, HTMLVideoElement>;
//   }
// }

const LiveKitMeeting: React.FC<LiveKitMeetingProps> = ({ onUsersUpdate }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const roomRef = useRef<Room | null>(null);
  const videoElementsRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  
  // const [isCameraOn, setIsCameraOn] = useState(true);
  // const [isMicOn, setIsMicOn] = useState(true);

  // ─────────────────────────────────────────────────────────────
  // Helper: تبدیل LocalParticipant به User
  // ─────────────────────────────────────────────────────────────
  const localParticipantToUser = (participant: LocalParticipant): User => {
    let hasVideo = false;
    participant.videoTrackPublications.forEach((pub: LocalTrackPublication) => {
      if (pub.track && !pub.isMuted) hasVideo = true;
    });

    let isMuted = true;
    participant.audioTrackPublications.forEach((pub: LocalTrackPublication) => {
      if (pub.track && !pub.isMuted) isMuted = false;
    });

    return {
      id: participant.identity,
      name: participant.name || participant.identity,
      hasVideo,
      isMuted,
      isSpeaking: participant.isSpeaking,
    };
  };

  // ─────────────────────────────────────────────────────────────
  // Helper: تبدیل RemoteParticipant به User
  // ─────────────────────────────────────────────────────────────
  const remoteParticipantToUser = (participant: RemoteParticipant): User => {
    let hasVideo = false;
    participant.videoTrackPublications.forEach((pub: RemoteTrackPublication) => {
      if (pub.track && !pub.isMuted) hasVideo = true;
    });

    let isMuted = true;
    participant.audioTrackPublications.forEach((pub: RemoteTrackPublication) => {
      if (pub.track && !pub.isMuted) isMuted = false;
    });

    return {
      id: participant.identity,
      name: participant.name || participant.identity,
      hasVideo,
      isMuted,
      isSpeaking: participant.isSpeaking,
    };
  };

  // ─────────────────────────────────────────────────────────────
  // بروزرسانی لیست کاربران
  // ─────────────────────────────────────────────────────────────
  const updateUsers = () => {
    const room = roomRef.current;
    if (!room || !onUsersUpdate) return;

    const users: User[] = [];

    // کاربر محلی
    users.push(localParticipantToUser(room.localParticipant));

    // کاربران remote
    room.remoteParticipants.forEach((participant) => {
      users.push(remoteParticipantToUser(participant));
    });

    onUsersUpdate(users);
  };

 

 

  // ─────────────────────────────────────────────────────────────
  // اتصال به LiveKit
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      toast.error('توکن وارد نشده است');
      return;
    }

    const room = new Room();
    roomRef.current = room;

    // ─────────────────────────────────────────────────────────────
    // رویداد: دریافت Track از سایر کاربران
    // ─────────────────────────────────────────────────────────────
    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Video) {
        const videoElement = track.attach() as HTMLVideoElement;
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';

        // const container = document.getElementById(`video-container-${participant.identity}`);
        // if (container) {
        //   container.innerHTML = '';
        //   container.appendChild(videoElement);
        //   videoElementsRef.current.set(participant.identity, videoElement);
        // }

        updateUsers(); // ✅ این خط هم باید اینجا باشه
      }
    });


    // ─────────────────────────────────────────────────────────────
    // رویداد: قطع Track
    // ─────────────────────────────────────────────────────────────
    // room.on(RoomEvent.TrackUnsubscribed, (track, participant) => {
    //   track.detach().forEach((el) => el.remove());
    //   videoElementsRef.current.delete(participant.identity);
    //   updateUsers();
    // });

    // ─────────────────────────────────────────────────────────────
    // رویداد: ورود کاربر جدید
    // ─────────────────────────────────────────────────────────────
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log(`${participant.identity} وارد شد`);
      updateUsers();
    });

    // ─────────────────────────────────────────────────────────────
    // رویداد: خروج کاربر
    // ─────────────────────────────────────────────────────────────
    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log(`${participant.identity} خارج شد`);
      const videoEl = videoElementsRef.current.get(participant.identity);
      if (videoEl) {
        videoEl.remove();
        videoElementsRef.current.delete(participant.identity);
      }
      updateUsers();
    });

    // ─────────────────────────────────────────────────────────────
    // رویداد: تغییر وضعیت صحبت کردن
    // ─────────────────────────────────────────────────────────────
    room.on(RoomEvent.ActiveSpeakersChanged, () => {
      updateUsers();
    });

    // ─────────────────────────────────────────────────────────────
    // اتصال به سرور
    // ─────────────────────────────────────────────────────────────
    (async () => {
      try {
        await room.connect('wss://asaflive.ir', token);
        console.log('✅ اتصال برقرار شد');
        toast.success('اتصال برقرار شد');

        await room.localParticipant.setCameraEnabled(true);
        await room.localParticipant.setMicrophoneEnabled(true);

        // نمایش ویدیوی خودمان
        room.localParticipant.videoTrackPublications.forEach((publication) => {
          if (publication.track) {
            const videoElement = publication.track.attach() as HTMLVideoElement;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';

            const container = document.getElementById(`video-container-${room.localParticipant.identity}`);
            if (container) {
              container.innerHTML = '';
              container.appendChild(videoElement);
              videoElementsRef.current.set(room.localParticipant.identity, videoElement);
            }
          }
        });

        updateUsers();
      } catch (error) {
        console.error('خطا در اتصال:', error);
        toast.error('خطا در اتصال به سرور');
      }
    })();

    // ─────────────────────────────────────────────────────────────
    // پاکسازی هنگام Unmount
    // ─────────────────────────────────────────────────────────────
    return () => {
      videoElementsRef.current.forEach((el) => el.remove());
      videoElementsRef.current.clear();
      room.disconnect();
      roomRef.current = null;
    };
  }, [token, onUsersUpdate]);

  return null; // این کامپوننت UI ندارد
};

export default LiveKitMeeting;
