import { useState, useRef, useEffect, useCallback } from 'react';

import { handleMeetingSetup } from '../../hooks/pubFunc/controllFunc.ts';

interface DeviceItem {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

type ResolutionPreset = '320x240' | '640x480' | '1280x720' | '1920x1080';

const RESOLUTION_MAP: Record<ResolutionPreset, { width: number; height: number; label: string }> = {
  '320x240': { width: 320, height: 240, label: '240p (کم‌کیفیت)' },
  '640x480': { width: 640, height: 480, label: '480p (متوسط)' },
  '1280x720': { width: 1280, height: 720, label: '720p (HD)' },
  '1920x1080': { width: 1920, height: 1080, label: '1080p (Full HD)' },
};

export default function MediaTestEnvironment() {
  const [videoDevices, setVideoDevices] = useState<DeviceItem[]>([]);
  const [audioDevices, setAudioDevices] = useState<DeviceItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string>('');
  const [resolution, setResolution] = useState<ResolutionPreset>('1280x720');
  const [actualResolution, setActualResolution] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // const { audioDevices, videoDevices, errorType, isProcessing } = useMeetingHardware();


  /* ----------------------------- Device Listing ---------------------------- */
  useEffect(() => {
    handleMeetingSetup();
    // console.log("وضعیت فعلی سخت‌افزار:", { audioDevices, videoDevices, errorType, isProcessing });
  }, []);


  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videos = devices.filter(d => d.kind === 'videoinput');
      const audios = devices.filter(d => d.kind === 'audioinput' && !d.deviceId.includes("default") && !d.deviceId.includes("communications"));
      // console.log("video", videos);
      // console.log("audio", audios);

      setVideoDevices(
        videos.map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `دوربین ${i + 1}`,
          kind: d.kind,
        }))
      );

      setAudioDevices(
        audios.map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `میکروفون ${i + 1}`,
          kind: d.kind,
        }))
      );

      if (videos.length && !selectedVideo) setSelectedVideo(videos[0].deviceId);
      if (audios.length && !selectedAudio) setSelectedAudio(audios[0].deviceId);

    } catch {
      setError('خطا در دریافت لیست دستگاه‌ها. دسترسی مرورگر را بررسی کنید.');
    }
  };

  /* ------------------------------ Audio Meter ------------------------------ */
  const analyzeAudio = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const avg = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setAudioLevel(Math.min(100, (avg / 255) * 150));

    animationRef.current = requestAnimationFrame(analyzeAudio);
  };

  /* ---------------------- Update Actual Resolution Display ------------------- */
  const updateActualResolution = useCallback(() => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      const settings = videoTrack.getSettings();
      setActualResolution(`${settings.width}×${settings.height}`);
    }
  }, []);

  /* ------------------------------ Start Stream ----------------------------- */
  const startStream = useCallback(async (res?: ResolutionPreset) => {
    const currentRes = res || resolution;
    const { width, height } = RESOLUTION_MAP[currentRes];

    try {
      setError('');

      // اگر استریم قبلی وجود داره، فقط video track رو عوض کن
      if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];

        if (videoTrack) {
          // اول تلاش با applyConstraints (بدون قطع استریم)
          try {
            await videoTrack.applyConstraints({
              width: { ideal: width },
              height: { ideal: height },
              deviceId: { exact: selectedVideo },
            });
            updateActualResolution();
            return;
          } catch {
            // اگر applyConstraints کار نکرد، ری‌استارت کامل
            videoTrack.stop();
          }
        }
      }

      // ری‌استارت کامل استریم
      stopStream();

      const constraints: MediaStreamConstraints = {
        video: selectedVideo
          ? {
            deviceId: { exact: selectedVideo },
            width: { ideal: width, max: width },
            height: { ideal: height, max: height },
          }
          : false,
        audio: selectedAudio
          ? {
            deviceId: { exact: selectedAudio },
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
          : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }

      if (selectedAudio) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        analyzeAudio();
      }

      setIsStreaming(true);

      // نمایش رزولوشن واقعی بعد از یک تأخیر کوتاه
      setTimeout(updateActualResolution, 500);
    } catch (err: any) {
      setError(`خطا در شروع استریم: ${err.message}`);
    }
  }, [resolution, selectedVideo, selectedAudio, updateActualResolution]);

  /* ------------------------------ Stop Stream ------------------------------ */
  const stopStream = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;

    setAudioLevel(0);
    setActualResolution('');
    setIsStreaming(false);
  };

  /* -------------- تغییر رزولوشن در لحظه (وقتی استریم فعاله) -------------- */
  const handleResolutionChange = async (preset: ResolutionPreset) => {
    setResolution(preset);

    if (!isStreaming) return;

    // کاملاً استریم قبلی رو ببند
    stopStream();

    // صبر کن تا track قبلی آزاد بشه
    await new Promise(resolve => setTimeout(resolve, 300));

    // استریم جدید با رزولوشن جدید
    const { width, height } = RESOLUTION_MAP[preset];

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: { exact: selectedVideo },
          width: { exact: width },    // ← exact به جای ideal
          height: { exact: height },
        },
        audio: selectedAudio
          ? {
            deviceId: { exact: selectedAudio },
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
          : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }

      if (selectedAudio) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        analyzeAudio();
      }

      setIsStreaming(true);

      setTimeout(() => {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings();
          setActualResolution(`${settings.width}×${settings.height}`);
        }
      }, 500);
    } catch (err: any) {
      if (err.name === 'OverconstrainedError') {
        setError(`دوربین شما رزولوشن ${RESOLUTION_MAP[preset].label} رو ساپورت نمی‌کنه.`);
        // fallback به ideal
        await startStream(preset);
      } else {
        setError(`خطا: ${err.message}`);
      }
    }
  };


  /* ------------------------------ Lifecycle ------------------------------ */
  useEffect(() => {
    getDevices();

    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------------- Render -------------------------------- */
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-xl space-y-6">
      <h2 className="text-xl font-bold text-center">محیط تست صدا و تصویر</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500 p-3 rounded">
          {error}
        </div>
      )}

      {/* Video Preview */}
      <div className="relative bg-black rounded-lg overflow-hidden border border-gray-700">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-[320px] object-cover"
        />
        {/* نمایش رزولوشن واقعی */}
        {actualResolution && (
          <div className="absolute top-2 left-2 bg-black/70 text-xs px-2 py-1 rounded">
            رزولوشن واقعی: {actualResolution}
          </div>
        )}
      </div>

      {/* Device Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">انتخاب دوربین</label>
          <select
            value={selectedVideo}
            onChange={e => setSelectedVideo(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2"
          >
            {videoDevices.map(d => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">انتخاب میکروفون</label>
          <select
            value={selectedAudio}
            onChange={e => setSelectedAudio(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2"
          >
            {audioDevices.map(d => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resolution — اعمال لحظه‌ای */}
      <div>
        <label className="block text-sm mb-2">کیفیت تصویر (رزولوشن)</label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(RESOLUTION_MAP) as [ResolutionPreset, typeof RESOLUTION_MAP[ResolutionPreset]][]).map(
            ([key, val]) => (
              <button
                key={key}
                onClick={() => handleResolutionChange(key)}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${resolution === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
              >
                {val.label}
              </button>
            )
          )}
        </div>
        {actualResolution && (
          <p className="text-xs text-gray-400 mt-1">
            رزولوشن درخواستی: {RESOLUTION_MAP[resolution].width}×{RESOLUTION_MAP[resolution].height} | واقعی: {actualResolution}
          </p>
        )}
      </div>

      {/* Audio Meter */}
      <div>
        <label className="block text-sm mb-2">سطح صدا</label>
        <div className="w-full h-4 bg-gray-700 rounded overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-75"
            style={{ width: `${audioLevel}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!isStreaming ? (
          <button
            onClick={() => startStream()}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            شروع تست
          </button>
        ) : (
          <button
            onClick={stopStream}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            توقف
          </button>
        )}
      </div>
    </div>
  );
}
