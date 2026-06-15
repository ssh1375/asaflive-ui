import React, { useState, useCallback } from "react";
// فرض بر این است که این کامپوننت‌ها در پروژه شما وجود دارند
import TextInput from "./shared/Forms/TextInput";
import Checkbox from "./shared/Forms/Checkbox";

// ۱. تعریف دقیق ساختار داده بر اساس قالب درخواستی شما
interface PermissionItem {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean; // برای تشخیص دسترسی‌های اضافه‌شده توسط کاربر و امکان حذف آن‌ها
}

// ۲. لیست اولیه دسترسی‌ها با فرمت جدید
const INITIAL_PERMISSIONS: PermissionItem[] = [
  {
    id: "2c2a04d3-d726-4e3d-be3f-60f9d9d12ace",
    name: "مدیریت کاربران",
    description: "Claim new insurance issue",
  },
  {
    id: "3fb1724c-7130-4fe2-9034-a5021aa9e0be",
    name: "نمایش بدهی ها",
    description: "",
  },
  {
    id: "a196e4c0-fec3-4d07-ae46-4991c197fc22",
    name: "خوانش موارد",
    description: "",
  },
  {
    id: "ed81f08d-3b78-42bf-9341-2d8776ec51d7",
    name: "insurance-cmr:claim",
    description: "Claim new insurance issue",
  },
];

interface Role {
  name: string;
  description: string;
  activePermissions: string[]; 
}

export default function RoleForm() {
  const [role, setRole] = useState<Role>({
    name: "",
    description: "",
    activePermissions: [],
  });

  // مدیریت وضعیت لیست کل دسترسی‌های سیستم
  const [availablePermissions, setAvailablePermissions] = useState<PermissionItem[]>(INITIAL_PERMISSIONS);
  
  // وضعیت‌های مربوط به فرم افزودن دسترسی جدید
  const [newPermName, setNewPermName] = useState("");
  const [newPermDesc, setNewPermDesc] = useState("");

  const handleInputChange = (field: keyof Role, value: string) => {
    setRole((prev) => ({ ...prev, [field]: value }));
  };

  const addNewPermission = () => {
    const name = newPermName.trim();
    if (!name) return;

    if (availablePermissions.some((p) => p.name === name)) return;

    const newId = crypto.randomUUID ? crypto.randomUUID() : `custom-${Date.now()}`;

    const newPermission: PermissionItem = {
      id: newId,
      name: name,
      description: newPermDesc.trim(),
      isCustom: true,
    };

    setAvailablePermissions((prev) => [...prev, newPermission]);
    setNewPermName("");
    setNewPermDesc("");
  };

  // حذف آبشاری (Cascade Delete): حذف از سیستم و نقش جاری
  const removePermissionDef = (permId: string) => {
    setAvailablePermissions((prev) => prev.filter((p) => p.id !== permId));
    setRole((prev) => ({
      ...prev,
      activePermissions: prev.activePermissions.filter((id) => id !== permId),
    }));
  };

  // تغییر وضعیت (Toggle) انتخاب دسترسی برای نقش
  const togglePermission = useCallback((permId: string) => {
    setRole((prev) => {
      const hasPerm = prev.activePermissions.includes(permId);
      return {
        ...prev,
        activePermissions: hasPerm
          ? prev.activePermissions.filter((id) => id !== permId)
          : [...prev.activePermissions, permId],
      };
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Role Payload:", JSON.stringify(role, null, 2));
    // Payload ارسالی به API کاملا منطبق بر ساختار RESTful خواهد بود
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4" dir="rtl">
      <div className="w-full max-w-4xl bg-black/60 border border-blue-500/30 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
        
        <h2 className="text-xl font-bold text-blue-400 border-b border-blue-500/20 pb-3">
          ایجاد نقش کاربری جدید
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* بخش اطلاعات پایه نقش */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <TextInput
                value={role.name}
                onValueChange={(val) => handleInputChange("name", val)}
                placeholder="نام نقش (مثال: مدیر مالی)"
                required
              />
            </div>
            <div className="flex-[2] min-w-[250px]">
              <TextInput
                value={role.description}
                onValueChange={(val) => handleInputChange("description", val)}
                placeholder="توضیحات کلی در مورد این نقش..."
              />
            </div>
          </div>

          {/* بخش مدیریت دسترسی‌ها */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-200 border-b border-white/5 pb-2">
              تخصیص دسترسی‌ها
            </h3>

            {/* گرید دسترسی‌ها */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePermissions.map((perm) => {
                const isChecked = role.activePermissions.includes(perm.id);
                return (
                  <div
                    key={perm.id}
                    className={`flex items-start justify-between p-3 rounded-lg border transition-all duration-200 ${
                      isChecked
                        ? "bg-blue-500/10 border-blue-500/40"
                        : "bg-black/20 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                      <div className="pt-1">
                        <Checkbox
                          checked={isChecked}
                          onToggle={() => togglePermission(perm.id)}
                        />
                      </div>
                      <div className="flex flex-col select-none">
                        <span className={`text-sm font-medium ${isChecked ? "text-blue-100" : "text-gray-300"}`}>
                          {perm.name}
                        </span>
                        {perm.description && (
                          <span className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {perm.description}
                          </span>
                        )}
                      </div>
                    </label>

                    {perm.isCustom && (
                      <button
                        type="button"
                        onClick={() => removePermissionDef(perm.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors px-2 text-lg"
                        title="حذف کامل این دسترسی از سیستم"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            
            {availablePermissions.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">هیچ دسترسی در سیستم تعریف نشده است.</p>
            )}
          </div>

          {/* فرم افزودن دسترسی سفارشی (Custom Permission) */}
          <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row gap-3 items-end">
             <div className="flex-1 w-full">
               <label className="block text-xs text-gray-400 mb-1">نام دسترسی جدید</label>
               <input
                  value={newPermName}
                  onChange={(e) => setNewPermName(e.target.value)}
                  placeholder="مثال: report:export_pdf"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
               />
             </div>
             <div className="flex-1 w-full">
               <label className="block text-xs text-gray-400 mb-1">توضیحات (اختیاری)</label>
               <input
                  value={newPermDesc}
                  onChange={(e) => setNewPermDesc(e.target.value)}
                  placeholder="توضیح کوتاه..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNewPermission(); } }}
               />
             </div>
             <button
                type="button"
                onClick={addNewPermission}
                disabled={!newPermName.trim()}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors"
             >
                افزودن به لیست
             </button>
          </div>

          {/* دکمه عملیات نهایی */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 cursor-pointer"
            >
              ذخیره نقش
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
