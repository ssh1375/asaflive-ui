import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MeetingType = 'CARGO_DAMAGE' | 'SIMPLE_MEETING' | 'INSURANCE_VISIT';

interface MeetingTypeModalProps {
  isOpen: boolean;
  onSelect: (type: MeetingType) => void;
  onClose: () => void;
}

const meetingTypes: { key: MeetingType; title: string; description: string; icon: React.ReactNode }[] = [
  {
    key: 'CARGO_DAMAGE',
    title: 'خسارت حمل و نقل',
    description: 'بررسی و مدیریت خسارت‌های وارده',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  {
    key: 'INSURANCE_VISIT',
    title: 'بازدید',
    description: 'پیش‌بینی و پیشگیری از خسارت‌های احتمالی',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
    {
    key: 'SIMPLE_MEETING',
    title: 'جلسه دور همی',
    description: 'گفت‌وگوی دوستانه و هماهنگی تیم',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
        <line x1="6" y1="2" x2="6" y2="4"/>
        <line x1="10" y1="2" x2="10" y2="4"/>
        <line x1="14" y1="2" x2="14" y2="4"/>
      </svg>
    ),
  }
];

const MeetingTypeModal: React.FC<MeetingTypeModalProps> = ({ isOpen, onSelect, onClose }) => {
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
            // dir="rtl"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent" />

            <div className="text-center mt-2">
              <h2 className="text-zinc-100 font-extrabold text-xl tracking-tight">انتخاب نوع جلسه</h2>
              <p className="text-zinc-400 text-sm mt-2 font-medium">لطفاً یکی از گزینه‌های زیر را برای شروع انتخاب کنید</p>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              {meetingTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => onSelect(type.key)}
                  className="group flex items-center gap-4 p-3.5 cursor-pointer rounded-2xl bg-zinc-800/40 border border-zinc-700/40 hover:border-blue-500/40 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 text-right active:scale-[0.98]"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-700/30 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-300 shrink-0">
                    {type.icon}
                  </div>
                  
                  <div className="flex-1 py-1">
                    <div className="text-zinc-100 font-bold text-sm group-hover:text-blue-300 transition-colors">
                      {type.title}
                    </div>
                    <div className="text-zinc-500 text-xs mt-1 leading-relaxed group-hover:text-zinc-400 transition-colors">
                      {type.description}
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/0 group-hover:bg-zinc-700/50 transition-all duration-300 transform group-hover:-translate-x-1">
                    <svg
                      className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 transition-colors rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 cursor-pointer rounded-xl text-sm font-semibold self-center transition-all duration-200 active:scale-95"
            >
              انصراف
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeetingTypeModal;
