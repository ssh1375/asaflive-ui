// RoleForm.tsx
import { useState } from "react";

const MODULES = ["کاربران", "گزارش‌ها", "تنظیمات", "مالی", "محصولات", "پشتیبانی"];
const ACTIONS = [
  { id: "read",   label: "خواندن" },
  { id: "write",  label: "نوشتن" },
  { id: "delete", label: "حذف"    },
  { id: "export", label: "خروجی"  },
];

type Perms = Record<string, Record<string, boolean>>;

const initPerms = (): Perms =>
  Object.fromEntries(
    MODULES.map((m) => [m, Object.fromEntries(ACTIONS.map((a) => [a.id, false]))])
  );

export default function DefineUser() {
  const [roleName, setRoleName]       = useState("");
  const [description, setDescription] = useState("");
  const [perms, setPerms]             = useState<Perms>(initPerms());

  const toggle = (mod: string, act: string) =>
    setPerms((p) => ({ ...p, [mod]: { ...p[mod], [act]: !p[mod][act] } }));

  const toggleRow = (mod: string) => {
    const allOn = ACTIONS.every((a) => perms[mod][a.id]);
    setPerms((p) => ({
      ...p,
      [mod]: Object.fromEntries(ACTIONS.map((a) => [a.id, !allOn])),
    }));
  };

  return (
    <div  className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-black/60 border border-blue-500/30 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">

        <h2 className="text-xl font-bold text-blue-400 border-b border-blue-500/20 pb-3">
          تعریف نقش کاربری
        </h2>

        {/* نام و توضیحات */}
        <div className="flex gap-3">
          <input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="نام نقش"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحات (اختیاری)"
            className="flex-[2] bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* جدول دسترسی‌ها */}
        <div className="rounded-xl overflow-hidden border border-white/10">

          {/* هدر */}
          <div className="grid bg-white/5 px-4 py-2 text-sm text-gray-400 font-medium"
            style={{ gridTemplateColumns: `1fr repeat(${ACTIONS.length}, 1fr)` }}>
            <span>ماژول</span>
            {ACTIONS.map((a) => (
              <span key={a.id} className="text-center">{a.label}</span>
            ))}
          </div>

          {/* ردیف‌ها */}
          {MODULES.map((mod, i) => {
            const allOn = ACTIONS.every((a) => perms[mod][a.id]);
            return (
              <div
                key={mod}
                className={`grid items-center px-4 py-3 transition-colors
                  ${i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}
                  hover:bg-blue-500/5`}
                style={{ gridTemplateColumns: `1fr repeat(${ACTIONS.length}, 1fr)` }}
              >
                {/* نام ماژول با toggle کل ردیف */}
                <button
                  type="button"
                  onClick={() => toggleRow(mod)}
                  className={`text-right text-sm font-medium transition-colors
                    ${allOn ? "text-blue-400" : "text-gray-300"}`}
                >
                  {mod}
                </button>

                {/* دکمه‌های عملیات */}
                {ACTIONS.map((act) => {
                  const on = perms[mod][act.id];
                  return (
                    <div key={act.id} className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => toggle(mod, act.id)}
                        className={`w-6 h-6 rounded border flex items-center justify-center transition-colors cursor-pointer
                          ${on
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-600 hover:border-gray-400 bg-transparent"}`}
                      >
                        {on && (
                          <svg viewBox="0 0 12 10" className="w-3 h-3">
                            <path d="M1 5l3 4L11 1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="self-end bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-2 rounded-lg transition-colors cursor-pointer"
        >
          ذخیره
        </button>
      </div>
    </div>
  );
}
