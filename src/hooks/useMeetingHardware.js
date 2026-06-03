// file: hooks/useMeetingHardware.js
import { useState } from 'react';

export const useMeetingHardware = () => {
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [errorType, setErrorType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const requestHardwareAccess = async () => {
    setIsProcessing(true);
    setErrorType(null)
    try {
      const initialDevices = await navigator.mediaDevices.enumerateDevices();
      const hasAudio = initialDevices.some(d => d.kind === 'audioinput');
      const hasVideo = initialDevices.some(d => d.kind === 'videoinput');
      if (!hasAudio && !hasVideo) {
        throw new Error('NotFoundError: هیچ دستگاه ورودی یافت نشد.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      const allDevices = await navigator.mediaDevices.enumerateDevices();

      setAudioDevices(allDevices.filter(d => d.kind === 'audioinput' && !d.deviceId.includes("default")));
      setVideoDevices(allDevices.filter(d => d.kind === 'videoinput'));

      setIsProcessing(false);
      return true;

    } catch (error) {
      console.error("مجوز رد شد:", error);
      setIsProcessing(false);
      return false;
    }
  };

  return {
    audioDevices,
    videoDevices,
    errorType,
    isProcessing,
    requestHardwareAccess
  };
};
