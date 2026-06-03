import React, { useState, useEffect } from 'react';

interface LiveMonitorProps {
  locationName?: string;
  coordinates?: string;
  watermark?: string;
}

const LiveMonitor: React.FC<LiveMonitorProps> = ({
  locationName = 'Tehran, Iran',
  coordinates = '35.6892° N, 51.3890° E',
  watermark = 'MY_BRAND_LIVE',
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const formattedTime = time.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    // تغییر کلیدی: استفاده از absolute inset-0 به جای relative
    // این کار باعث می‌شود مانیتور دقیقا به لبه‌های نزدیک‌ترین والدِ relative خود بچسبد
    <div className="absolute inset-0 pointer-events-none overflow-hidden font-mono z-40">
      
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>

      <div className="absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-16 md:h-16 border-t-4 border-l-4 border-white/70 rounded-tl-lg drop-shadow-lg"></div>
      <div className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-16 md:h-16 border-t-4 border-r-4 border-white/70 rounded-tr-lg drop-shadow-lg"></div>
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-8 h-8 md:w-16 md:h-16 border-b-4 border-l-4 border-white/70 rounded-bl-lg drop-shadow-lg"></div>
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-16 md:h-16 border-b-4 border-r-4 border-white/70 rounded-br-lg drop-shadow-lg"></div>

      <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8 lg:p-12 text-white/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 md:gap-3 bg-black/30 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-white/10">
            <span className="relative flex h-3 w-3 md:h-4 md:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-red-600"></span>
            </span>
            <span className="font-bold tracking-widest text-xs md:text-sm text-red-500 mt-0.5 whitespace-nowrap">REC / LIVE</span>
          </div>

          <div className="flex flex-col items-end bg-black/30 px-3 py-1.5 md:px-4 md:py-2 rounded-lg backdrop-blur-sm border border-white/10">
            <span className="text-lg md:text-xl font-bold tracking-wider">{formattedTime}</span>
            <span className="text-[10px] md:text-xs text-white/70 tracking-widest">{formattedDate}</span>
          </div>
        </div>
      
        <div className="flex justify-between items-end gap-2">
          <div className="flex flex-col gap-1 bg-black/30 px-3 py-2 md:px-4 md:py-3 rounded-lg backdrop-blur-sm border border-white/10 max-w-[150px] md:max-w-sm">
            <div className="flex items-center gap-1 md:gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold text-xs md:text-sm tracking-wide truncate">{locationName}</span>
            </div>
            <span className="text-[9px] md:text-xs text-white/60 ml-5 md:ml-7 tracking-wider truncate">{coordinates}</span>
          </div>

          <div className="opacity-50 hover:opacity-100 transition-opacity duration-500 select-none hidden sm:block">
            <span className="text-xl md:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              {watermark}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveMonitor;
