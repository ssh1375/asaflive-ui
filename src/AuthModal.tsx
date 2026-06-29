import React, { useState } from 'react';
import api from './api/api';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginSchema, registerSchema } from './hooks/validation/login-form-validation';



interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isLoginRoute = location.pathname.toLowerCase().includes('login');

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const schema = activeTab === 'login' ? loginSchema : registerSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      setError(firstError ?? "اطلاعات وارد شده معتبر نیست");
      setIsLoading(false);
      return;
    }
    try {
      const payload = activeTab === 'login'
        ? { phone: formData.phone, password: formData.password }
        : { ...formData };

      const endpoint = activeTab === 'login' ? '/auth/login' : '/auth/register';

      await api.post(endpoint, payload);
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("عملیات با موفقیت انجام شد", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });

      onSuccess?.();
      onClose?.();
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      const isBusinessError = err?.name === "BusinessError";
      const isUniqueConstraint =
        isBusinessError &&
        (err?.message?.includes("Unique constraint violation"));

      isUniqueConstraint
        ? setError("این کاربر قبلاً ثبت شده است. لطفاً وارد شوید.")
        : setError("خطایی در ارتباط با سرور رخ داد. مجدداً تلاش کنید.");

      toast.error("خطایی در انجام عملیات رخ داد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md transition-opacity">

      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative mx-4 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >

        {!isLoginRoute && (
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="بستن"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}


        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-extrabold text-gray-800">
            {activeTab === 'login' ? 'خوش آمدید' : 'ساخت حساب جدید'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {activeTab === 'login' ? 'برای ادامه وارد حساب کاربری خود شوید' : 'اطلاعات خود را برای ثبت نام وارد کنید'}
          </p>
        </div>


        <div className="flex p-1 bg-gray-100 rounded-xl mb-8 relative">
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 z-10 ${activeTab === 'login'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => { setActiveTab('login'); setError(null); }}
          >
            ورود
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 z-10 ${activeTab === 'register'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => { setActiveTab('register'); setError(null); }}
          >
            ثبت نام
          </button>
        </div>


        {error && (
          <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {activeTab === 'register' && (
            <div className="flex gap-4">
              <div className="w-1/2 relative">
                <input
                  type="text"
                  name="firstName"
                  placeholder="نام"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>
              <div className="w-1/2 relative">
                <input
                  type="text"
                  name="lastName"
                  placeholder="نام خانوادگی"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          )}

          <div className="relative">
            <input
              type="tel"
              name="phone"
              placeholder="شماره موبایل (مثلا 0912...)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm text-left font-mono"
              dir="ltr"
            />
          </div>

          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="رمز عبور"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm text-left font-mono"
              dir="ltr"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute cursor-pointer right-0 top-0 h-full px-4 flex items-center text-gray-400 hover:text-indigo-500 transition-colors focus:outline-none"
              aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 mt-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>در حال پردازش...</span>
              </>
            ) : (
              activeTab === 'login' ? 'ورود به حساب' : 'ایجاد حساب کاربری'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

