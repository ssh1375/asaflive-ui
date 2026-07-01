export const handleMeetingSetup = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideo = devices.some(device => device.kind === 'videoinput');
    const hasAudio = devices.some(device => device.kind === 'audioinput');
    if (!hasVideo && !hasAudio) {
        console.warn("هیچ سخت‌افزار ورودی (صدا یا تصویر) روی این سیستم یافت نشد.");
        return null;
    }
    console.log("دستگاه‌های ورودی شناسایی‌شده:", hasVideo);
    const streams = await navigator.mediaDevices.getUserMedia({
        video: hasVideo,
        audio: hasAudio
    });
    if (streams) {
        console.log("استریم با موفقیت دریافت شد:", streams);
    }
    return {
        video: streams.getVideoTracks()[0],
        audio: streams.getAudioTracks()[0],
        stream: streams
    }
};