import React, { useState, useEffect, useRef, useCallback } from 'react';

type CameraType = 'user' | 'environment';
type PermissionStatus = 'pending' | 'granted' | 'denied' | 'prompt';

const MobileMediaTester: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');
  const [activeCamera, setActiveCamera] = useState<CameraType | null>(null);
  
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioBarRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const fetchAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter((device) => device.kind === 'audioinput');
      setAudioDevices(audioInputs);
      
      if (audioInputs.length > 0 && !selectedAudioId) {
        setSelectedAudioId(audioInputs[0].deviceId);
      }
    } catch (error) {
      console.error('Error fetching audio devices:', error);
    }
  };

  // تابع اصلی برای گرفتن دسترسی و مدیریت خطاها
  const getPermissionForDeviceAccess = async (): Promise<void> => {
    setPermissionStatus('pending');
    try {
      // درخواست دسترسی
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // اگر موفق بود، استریم موقت را می‌بندیم تا دوربین بی‌دلیل روشن نماند
      stream.getTracks().forEach((track) => track.stop());
      
      setPermissionStatus('granted');
      await fetchAudioDevices();
    } catch (error: any) {
      console.error('Permission error:', error);
      
      // اگر کاربر دسترسی را مسدود کرده باشد یا دستگاه کلاً پشتیبانی نکند
      if (error.name === 'NotAllowedError' || error.name === 'NotFoundError') {
        setPermissionStatus('denied');
      } else {
        alert('خطای ناشناخته در دسترسی به دوربین/میکروفون.');
        setPermissionStatus('denied');
      }
    }
  };

  const stopCurrentStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioBarRef.current) {
      audioBarRef.current.style.width = '0%';
    }
  }, []);

  const analyzeAudio = useCallback(async (stream: MediaStream) => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const audioCtx = audioContextRef.current;
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const analyser = audioCtx.createAnalyser();
    const microphone = audioCtx.createMediaStreamSource(stream);
    
    microphone.connect(analyser);
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const percentage = Math.min(100, (average / 128) * 100);

      if (audioBarRef.current) {
        audioBarRef.current.style.width = `${percentage}%`;
      }

      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  }, []);

  const startCamera = async (type: CameraType, audioIdToUse: string = selectedAudioId) => {
    try {
      stopCurrentStream();
      setActiveCamera(type);

      const audioConstraint = audioIdToUse ? { deviceId: { exact: audioIdToUse } } : true;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: type } },
        audio: audioConstraint,
      });
      
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      await analyzeAudio(stream);
    } catch (err) {
      console.error(err);
      alert('خطا در اجرای دوربین. ممکن است دسترسی مسدود شده باشد.');
      setActiveCamera(null);
      setPermissionStatus('denied');
    }
  };

  const handleAudioDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAudioId = e.target.value;
    setSelectedAudioId(newAudioId);
    if (activeCamera) {
      startCamera(activeCamera, newAudioId);
    }
  };

  useEffect(() => {
    // گرفتن دسترسی در ابتدای ورود به کامپوننت
    getPermissionForDeviceAccess();

    navigator.mediaDevices.addEventListener('devicechange', fetchAudioDevices);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', fetchAudioDevices);
      stopCurrentStream();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopCurrentStream]);

  // رندر کردن حالت "عدم دسترسی"
  if (permissionStatus === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-6" dir="rtl">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            !
          </div>
          <h2 className="text-xl font-bold mb-3">دسترسی مسدود شده است</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            شما دسترسی مرورگر به دوربین یا میکروفون را مسدود کرده‌اید. 
            برای استفاده از این ابزار، لطفاً روی <strong>آیکون قفل کنار نوار آدرس مرورگر</strong> کلیک کنید، 
            دسترسی دوربین و میکروفون را فعال (Allow) کرده و سپس روی دکمه زیر کلیک کنید.
          </p>
          <button
            onClick={getPermissionForDeviceAccess}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all"
          >
            تلاش مجدد برای دسترسی
          </button>
        </div>
      </div>
    );
  }

  // اگر هنوز در حال بررسی است
  if (permissionStatus === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-4" dir="rtl">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">در حال دریافت دسترسی‌های لازم...</p>
        </div>
      </div>
    );
  }

  // رابط کاربری اصلی در صورت موفقیت
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-4" dir="rtl">
      <div className="w-full max-w-md flex flex-col items-center">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-3">ابزار تست موبایل</h2>
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium transition-colors bg-green-500/20 text-green-500">
            دسترسی برقرار است
          </span>
        </div>

        {audioDevices.length > 0 && (
          <div className="w-full mb-4">
            <label className="block text-sm text-gray-300 mb-2 font-medium">انتخاب میکروفون:</label>
            <select
              value={selectedAudioId}
              onChange={handleAudioDeviceChange}
              className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {audioDevices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `میکروفون شماره ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="w-full mb-6">
          <div className="text-xs text-gray-400 mb-2">سطح صدا:</div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              ref={audioBarRef}
              className="h-full bg-green-500 transition-all duration-75 ease-out"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        <div className="w-full aspect-[3/4] bg-gray-900 rounded-2xl overflow-hidden relative shadow-2xl mb-6 ring-1 ring-white/10">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${activeCamera === 'user' ? '-scale-x-100' : ''}`}
          />
          {!activeCamera && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              دوربینی انتخاب نشده است
            </div>
          )}
        </div>

        <div className="flex w-full gap-3">
          <button
            onClick={() => startCamera('user')}
            className={`flex-1 py-3.5 px-4 rounded-xl font-semibold transition-all ${
              activeCamera === 'user'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            دوربین جلو
          </button>
          
          <button
            onClick={() => startCamera('environment')}
            className={`flex-1 py-3.5 px-4 rounded-xl font-semibold transition-all ${
              activeCamera === 'environment'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            دوربین عقب
          </button>
        </div>

      </div>
    </div>
  );
};

export default MobileMediaTester;
