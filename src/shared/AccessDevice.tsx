import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type MediaDeviceType = 'microphone' | 'camera';

interface AccessDeviceProps {
  isOpen: boolean;
  onSelect: (type: MediaDeviceType) => void;
  onClose: () => void;
}

const mediaOptions: { key: MediaDeviceType; title: string; description: string; icon: React.ReactNode }[] = [
  {
    key: 'microphone',
    title: 'میکروفون',
    description: 'تنظیم و بررسی صدای ورودی',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    ),
  },
  {
    key: 'camera',
    title: 'دوربین',
    description: 'بررسی و تنظیم تصویر وب‌کم',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
        <path d="m22 8-6 4 6 4V8Z"/>
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
      </svg>
    ),
  }
];

const AccessDevice: React.FC<AccessDeviceProps> = ({ isOpen, onSelect, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-zinc-900 border border-zinc-700/50 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.7)] w-full max-w-md p-7 flex flex-col gap-6 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* افکت نوری بالای مودال */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent" />

            <div className="text-center mt-2">
              <h2 className="text-zinc-100 font-extrabold text-xl tracking-tight">بررسی سخت‌افزار</h2>
              <p className="text-zinc-400 text-sm mt-2 font-medium">لطفاً برای تست و تنظیمات، یکی از دستگاه‌های زیر را انتخاب کنید</p>
            </div>

            {/* تغییر ساختار به Grid برای نمایش بهتر ۲ گزینه */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {mediaOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => onSelect(option.key)}
                  className="group flex flex-col items-center justify-center gap-3 p-5 cursor-pointer rounded-2xl bg-zinc-800/40 border border-zinc-700/40 hover:border-blue-500/40 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 active:scale-[0.96]"
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-700/30 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-300">
                    {option.icon}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-zinc-100 font-bold text-sm group-hover:text-blue-300 transition-colors">
                      {option.title}
                    </div>
                    <div className="text-zinc-500 text-xs mt-1.5 leading-relaxed group-hover:text-zinc-400 transition-colors">
                      {option.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 cursor-pointer rounded-xl text-sm font-semibold self-center transition-all duration-200 active:scale-95"
            >
              انصراف و بازگشت
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccessDevice;
