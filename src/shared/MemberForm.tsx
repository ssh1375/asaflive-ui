
import { useState } from "react";
import { memberSchema, type MemberForm } from "../hooks/validation/member-schema";
import api from "../api/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";


export type MemberFormData = MemberForm;

type Errors = Record<string, string>;

const toBool = (v: string | undefined): boolean | undefined =>
  v === "yes" ? true : v === "no" ? false : undefined;

type MemberFormProps = {
  onSubmit: (data: MemberFormData) => void;
  onClose?: () => void;
};

export function MemberForm({ onSubmit, onClose }: MemberFormProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [receiveMedia, setReceiveMedia] = useState<string>("yes");
  const [sendMedia, setSendMedia] = useState<string>("yes");
  const [errors, setErrors] = useState<Errors>({});
  const { id } = useParams();
  setReceiveMedia("yes")
  setSendMedia("yes")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = memberSchema.safeParse({
      name,
      mobile,
      receiveMedia: toBool(receiveMedia),
      sendMedia: toBool(sendMedia),
    });

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }
    console.log(result);

    try {
      const res = await api.post(`/session-manager/invite/${id}`, {
        displayName: result?.data?.name,
        phone: result?.data?.mobile,
        permissions: { "roomJoin": true, "canPublish": result?.data?.sendMedia, "canSubscribe": result?.data?.receiveMedia }
      })
      console.log(res);
      toast.success("پیامک برای شخص مورد نظر ارسال گردید")
    } catch (error) {
      toast.error("خطا در افزودن کاربر به جلسه")
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <div className="member-form-container">

      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />


      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            dir="rtl"
            className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-2xl border border-zinc-700/50 p-6 space-y-5 animate-slideUp"
          >

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">افزودن عضو جدید</h2>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-700 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>


            <div className="field space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                نام فرد
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 bg-zinc-900/50 border ${errors.name ? 'border-red-500' : 'border-zinc-700'
                  } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                placeholder="نام و نام خانوادگی"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" className="text-red-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </span>
              )}
            </div>


            <div className="field space-y-2">
              <label htmlFor="mobile" className="block text-sm font-medium text-zinc-300">
                شماره موبایل
              </label>
              <input
                id="mobile"
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={`w-full px-4 py-3 bg-zinc-900/50 border ${errors.mobile ? 'border-red-500' : 'border-zinc-700'
                  } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                placeholder="09123456789"
                aria-invalid={!!errors.mobile}
                aria-describedby={errors.mobile ? "mobile-error" : undefined}
              />
              {errors.mobile && (
                <span id="mobile-error" className="text-red-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.mobile}
                </span>
              )}
            </div>


            <fieldset className="field space-y-2">
              <legend className="block text-sm font-medium text-zinc-300 mb-3">
                دریافت صدا و تصویر باقی اعضا
              </legend>
              <div className="flex gap-3 ">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg cursor-not-allowed transition-all hover:border-zinc-600 has-[:checked]:bg-blue-500/20 has-[:checked]:border-blue-500">
                  <input
                    type="radio"
                    name="receiveMedia"
                    value="yes"
                    checked={receiveMedia === "yes"}
                    // onChange={(e) => setReceiveMedia(e.target.value)}
                    disabled
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-white">بله</span>
                </label>
                <label className="flex-1 flex cursor-not-allowed  items-center justify-center gap-2 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg transition-all hover:border-zinc-600 has-[:checked]:bg-red-500/20 has-[:checked]:border-red-500">
                  <input
                    type="radio"
                    name="receiveMedia"
                    value="no"
                    checked={receiveMedia === "no"}
                    disabled
                    // onChange={(e) => setReceiveMedia(e.target.value)}
                    className="text-red-500 focus:ring-red-500 "
                  />
                  <span className="text-white">خیر</span>
                </label>
              </div>
              {errors.receiveMedia && (
                <span className="text-red-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.receiveMedia}
                </span>
              )}
            </fieldset>

            {/* Send Media Field */}
            <fieldset className="field space-y-2">
              <legend className="block text-sm font-medium text-zinc-300 mb-3">
                ارسال صدا و تصویر
              </legend>
              <div className="flex gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg cursor-not-allowed transition-all hover:border-zinc-600 has-[:checked]:bg-blue-500/20 has-[:checked]:border-blue-500">
                  <input
                    type="radio"
                    name="sendMedia"
                    value="yes"
                    checked={sendMedia === "yes"}
                    disabled
                    // onChange={(e) => setSendMedia(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-white">بله</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg cursor-not-allowed transition-all hover:border-zinc-600 has-[:checked]:bg-red-500/20 has-[:checked]:border-red-500">
                  <input
                    type="radio"
                    name="sendMedia"
                    value="no"
                    checked={sendMedia === "no"}
                    disabled
                    // onChange={(e) => setSendMedia(e.target.value)}
                    className="text-red-500 focus:ring-red-500"
                  />
                  <span className="text-white">خیر</span>
                </label>
              </div>
              {errors.sendMedia && (
                <span className="text-red-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.sendMedia}
                </span>
              )}
            </fieldset>


            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
            >
              ثبت اطلاعات
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}