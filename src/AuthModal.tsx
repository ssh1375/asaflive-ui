import React, { useState } from 'react';
import api from './api/api';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // استیت یکپارچه برای مدیریت تمام فیلدها
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

    try {
      const payload = activeTab === 'login' 
        ? { phone: formData.phone, password: formData.password }
        : { ...formData }; 

      const endpoint = activeTab === 'login' ? '/auth/login' : '/auth/register';

      const response = await api.post(endpoint, payload);
      console.log(response?.data?.status);
      
      if(response?.data?.status=="409"){
        toast.error("کاربر قبلا در سیستم تعریف شده است")
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("عملیات با موفقیت انجام شد")

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطایی رخ داده است.');
      toast.error("خطایی در انجام عملیات رخ داد")

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          ✕
        </button>

        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'login' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('login')}
          >
            ورود
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'register' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('register')}
          >
            ثبت نام
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {activeTab === 'register' && (
            <div className="flex gap-2">
              <input
                type="text"
                name="firstName"
                placeholder="نام"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-1/2 p-2 border rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="نام خانوادگی"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-1/2 p-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <input
            type="tel"
            name="phone"
            placeholder="شماره موبایل (مثلا 09362159116)"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 text-left"
            dir="ltr"
          />

          <input
            type="password"
            name="password"
            placeholder="رمز عبور"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 text-left"
            dir="ltr"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors mt-2"
          >
            {isLoading ? 'در حال پردازش...' : (activeTab === 'login' ? 'ورود به حساب' : 'ایجاد حساب کاربری')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
