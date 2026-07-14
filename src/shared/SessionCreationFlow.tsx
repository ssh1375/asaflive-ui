import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useSessionFlow,
  SessionFlowState,
  type SessionData,
  type SelectedMeetingType,
} from '../hooks/useSessionFlow';
import { sessionData } from '../hooks/validation/create-session-validation';

type SessionCreationFlowProps = {
  isOpen: boolean;
  initialType?: SelectedMeetingType;
  onSelect?: (type: SelectedMeetingType) => void;
  onSubmit: (data: SessionData, type: SelectedMeetingType) => void;
  onClose: () => void;
};

const meetingTypes: {
  key: SelectedMeetingType;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
    {
      key: 'khesarat',
      title: 'خسارت حمل و نقل',
      description: 'بررسی و مدیریت خسارت‌های وارده',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      key: 'beforeKhesarat',
      title: 'بازدید',
      description: 'پیش‌بینی و پیشگیری از خسارت‌های احتمالی',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      key: 'dorehami',
      title: 'جلسه دور همی',
      description: 'گفت‌وگوی دوستانه و هماهنگی تیم',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      ),
    },
  ];

const typeNames: Record<SelectedMeetingType, string> = {
  khesarat: 'خسارت حمل و نقل',
  beforeKhesarat: 'بازدید',
  dorehami: 'جلسه دور همی',
};

const inputClass =
  'w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all';
function MetadataForm({
  selectedType,
  defaultData,
  onSubmit,
  onCancel,
}: {
  selectedType: SelectedMeetingType;
  defaultData: SessionData;
  onSubmit: (data: SessionData) => void;
  onCancel: () => void;
}) {
  const typeName = typeNames[selectedType];
  const fallbackName = `${typeName} ${Date.now().toString().slice(-4)}`;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<SessionData>(defaultData);

  const update = useCallback(
    <K extends keyof SessionData>(key: K, value: SessionData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData: SessionData = {
      ...form,
      name: form.name.trim() || fallbackName,
      metadata: { ...form.metadata, type: selectedType },
    };
    console.log(form);

    const result = sessionData.safeParse(finalData);
    if (!result.success) {

      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      console.log(fieldErrors);

      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(finalData);

  };

  return (
    <motion.form
      className="flex flex-col gap-6"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onSubmit={handleSubmit}
    >
      <div className="text-center">
        <h2 className="text-zinc-100 font-extrabold text-xl tracking-tight">اطلاعات جلسه</h2>
        <p className="text-zinc-400 text-sm mt-1.5 font-medium">
          نام جلسه را وارد کنید و تنظیمات دلخواه را اعمال نمایید
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-zinc-300 text-sm font-semibold mb-1.5">
            نام جلسه
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={`مثلاً جلسه خسارت قرارداد 20053`}
            required
            className={inputClass}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-zinc-300 text-sm font-semibold mb-1.5">
              زمان خالی (دقیقه)
            </label>
            <input
              type="number"
              value={form.emptyTimeout}
              placeholder='زمان بین ۱ تا ۵ دقیقه'
              onChange={(e) => update('emptyTimeout', Number(e.target.value))}
              min={1}
              disabled
              className={inputClass +" cursor-not-allowed"}
            />
            {errors.emptyTimeout && <p className="text-red-500 text-sm">{errors.emptyTimeout}</p>}
          </div>
          <div>
            <label className="block text-zinc-300 text-sm font-semibold mb-1.5">
              ظرفیت (نفر)
            </label>
            <input
              type="number"
              value={form.maxParticipants}
              onChange={(e) => update('maxParticipants', Number(e.target.value))}
              min={1}
              max={20}
              className={inputClass}
            />
            {errors.maxParticipants && <p className="text-red-500 text-sm">{errors.maxParticipants}</p>}

          </div>
        </div>

        <div>
          <label className="block text-zinc-300 text-sm font-semibold mb-2">
            انقضای نشست
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { label: 'نیم ساعت', value: 1800 },
              { label: 'چهل و پنج دقیقه', value: 2700 },
              { label: 'یک ساعت', value: 3600 },
              { label: 'یک ساعت و نیم', value: 5400 },
              { label: 'دو ساعت', value: 7200 },
            ].map((opt) => {
              const active = form.sessionExpiry === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`cursor-pointer text-center px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-[0.97] ${active
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                    : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:border-blue-500/40 hover:bg-zinc-800/80'
                    }`}
                >
                  <input
                    type="radio"
                    name="sessionExpiry"
                    value={opt.value}
                    checked={active}
                    onChange={() => update('sessionExpiry', opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              );
            })}

          </div>
          {errors.sessionExpiry && <p className="text-red-500 text-sm mt-1">{errors.sessionExpiry}</p>}
        </div>

      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors active:scale-[0.98] shadow-lg shadow-blue-900/20"
        >
          تایید و ادامه
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition-colors active:scale-[0.98]"
        >
          بازگشت
        </button>
      </div>
    </motion.form>
  );
}

// ---------- انتخاب نوع (مرحله اول) ----------
function TypeSelection({
  onSelect,
  onClose,
}: {
  onSelect: (type: SelectedMeetingType) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="text-center">
        <h2 className="text-zinc-100 font-extrabold text-xl tracking-tight">انتخاب نوع جلسه</h2>
        <p className="text-zinc-400 text-sm mt-1.5 font-medium">
          لطفاً یکی از گزینه‌های زیر را برای شروع انتخاب کنید
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {meetingTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => {
              console.log(type.key);

              onSelect(type.key)
            }}
            className="group flex items-center gap-4 p-3.5 cursor-pointer rounded-2xl bg-zinc-800/40 border border-zinc-700/40 hover:border-blue-500/40 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 text-right active:scale-[0.98]"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-700/30 group-hover:bg-blue-500/10 transition-all duration-300 shrink-0">
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
            <svg
              className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 transition-colors rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-2 px-6 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl text-sm font-semibold self-center transition-all duration-200"
      >
        انصراف
      </button>
    </motion.div>
  );
}

const SessionCreationFlow: React.FC<SessionCreationFlowProps> = ({
  isOpen,
  initialType,
  onSelect,
  onSubmit,
  onClose,
}) => {
  const {
    flowState,
    selectedType,
    sessionData,
    selectType,
    goBackToTypeSelection,
    startOver,
  } = useSessionFlow(initialType);

  const handleTypeSelect = useCallback(
    (type: SelectedMeetingType) => {
      selectType(type);
      onSelect?.(type);
    },
    [selectType, onSelect]
  );

  const handleClose = useCallback(() => {
    startOver();
    onClose();
  }, [startOver, onClose]);

  const handleFinalSubmit = useCallback(
    (data: SessionData) => {
      if (!selectedType) return;
      onSubmit(data, selectedType);
    },
    [onSubmit, selectedType]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
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
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent" />

            <AnimatePresence mode="wait">
              {flowState === SessionFlowState.SELECTING_TYPE ? (
                <TypeSelection
                  key="step-type"
                  onSelect={handleTypeSelect}
                  onClose={handleClose}
                />
              ) : (
                selectedType && (
                  <MetadataForm
                    key="step-meta"
                    selectedType={selectedType}
                    defaultData={sessionData}
                    onSubmit={handleFinalSubmit}
                    onCancel={goBackToTypeSelection}
                  />
                )
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionCreationFlow;
