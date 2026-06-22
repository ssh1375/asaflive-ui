import React, { useState, useEffect, useCallback } from "react";

import TextInput from "./shared/Forms/TextInput";
import Checkbox from "./shared/Forms/Checkbox";

import { permissionsService, type PermissionItem } from "./services/permissions.service";
import toast from "react-hot-toast";
import api from "./api/api";
import GiveAllRoles from "./shared/Tabel/GiveAllRoles";

interface Domain {
  id: string;
  name: string;
}
interface Role {
  name: string;
  description: string;
  permissions: string[];
  domainId: string;
}

export default function RoleForm() {
  const [role, setRole] = useState<Role>({
    name: "",
    description: "",
    domainId: "",
    permissions: [],
  });
  const [domains, setDomains] = useState<Domain[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshRolesFlag, setRefreshRolesFlag] = useState(false);

  const [newPermName, setNewPermName] = useState("");
  const [newPermDesc, setNewPermDesc] = useState("");

  // حالت ویرایش
  const [editingPermId, setEditingPermId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const data = await permissionsService.getAll();
        console.log(data);

        if (String(data?.status) === "401" || String(data?.status) === "500") {
          toast.error('متاسفانه شما دسترسی به این بخش ندارید')
          throw new Error("دسترسی غیرمجاز است");
        }
        
        setAvailablePermissions(data);
        setError(null);
      } catch (err) {
        setError("خطا در دریافت لیست دسترسی‌ها");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);

        const res = await api.get<Domain[]>("/rbac/domains");
        const domainList = Array.isArray(res.data) ? res.data : [];

        setDomains(domainList);
        setError(null);

        const asafDomain = domainList.find((d) => d.name === "asaflive.ir");

        if (asafDomain) {
          setRole((prev) => ({
            ...prev,
            domainId: asafDomain.id,
          }));
        } else {
          console.warn('دامنه "asaflive.ir" در لیست دامین‌ها پیدا نشد');
        }
      } catch (err) {
        setError("خطا در دریافت لیست دامنه‌ها");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const handleInputChange = (field: keyof Role, value: string) => {
    setRole((prev) => ({ ...prev, [field]: value }));
  };

  const addNewPermission = async () => {
    const name = newPermName.trim();
    if (!name) return;

    if (availablePermissions?.some((p) => p.name === name)) return;

    try {
      const created = await permissionsService.create({
        name,
        description: newPermDesc.trim(),
      });

      setAvailablePermissions((prev) => [...prev, created]);
      setRole((prev) => ({
        ...prev,
        permissions: [...prev.permissions, created.id],
      }));
      setNewPermName("");
      setNewPermDesc("");
    } catch (err) {
      alert("افزودن دسترسی با خطا مواجه شد");
      console.error(err);
    }
  };

  const removePermissionDef = async (permId: string) => {
    try {
      await permissionsService.delete(permId);
      setAvailablePermissions((prev) => prev.filter((p) => p.id !== permId));
      setRole((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((id) => id !== permId),
      }));
    } catch (err) {
      alert("حذف دسترسی ناموفق بود");
      console.error(err);
    }
  };

  const togglePermission = useCallback((permId: string) => {
    setRole((prev) => {
      const hasPerm = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: hasPerm
          ? prev.permissions.filter((id) => id !== permId)
          : [...prev.permissions, permId],
      };
    });
  }, []);

  const startEdit = (perm: PermissionItem) => {
    setEditingPermId(perm.id);
    setEditName(perm.name);
    setEditDescription(perm.description || "");
  };

  const cancelEdit = () => {
    setEditingPermId(null);
    setEditName("");
    setEditDescription("");
  };

  const saveEdit = async (permId: string) => {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      toast.error("نام دسترسی نمی‌تواند خالی باشد");
      return;
    }

    try {
      await api.patch(`/rbac/permissions/${permId}`, {
        name: trimmedName,
        description: editDescription.trim(),
      });

      setAvailablePermissions((prev) =>
        prev.map((p) =>
          p.id === permId
            ? { ...p, name: trimmedName, description: editDescription.trim() }
            : p
        )
      );

      toast.success("دسترسی با موفقیت ویرایش شد");
      cancelEdit();
    } catch (err) {
      console.error(err);
       const isBusinessError = err?.name === "BusinessError";

      const isUniqueConstraint =
        isBusinessError &&
        (err?.message?.includes("Unique constraint violation"));
      isUniqueConstraint?toast.error("دسترسی تعریف شده است"):toast.error("خطا در ویرایش دسترسی")
      
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post("/rbac/roles", role)
      .then((res) => {
        toast.success("نقش با موفقیت ساخته شد");
        console.log("Submitting Role Payload:", JSON.stringify(role, null, 2));
        setRefreshRolesFlag(prev => !prev);
      })
      .catch((err) => {
        console.error(err);
        toast.error("خطا در ساخت نقش");
      });
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-900 p-4" dir="rtl">
      <div className="w-full max-w-4xl bg-black/60 border border-blue-500/30 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
        <h2 className="text-xl font-bold text-blue-400 border-b border-blue-500/20 pb-3">
          ایجاد نقش کاربری جدید
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNewPermission();
                  }
                }}
              />
            </div>

            <button
              type="button"
              onClick={addNewPermission}
              disabled={!newPermName.trim()}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-5 py-2 rounded-lg transition-colors"
            >
              افزودن به لیست
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-5 border border-white/10 flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-200 border-b border-white/5 pb-2">
              تخصیص دسترسی‌ها
            </h3>

            {loading && (
              <div className="flex justify-center py-4">
                <span className="text-gray-400 text-sm">در حال بارگذاری دسترسی‌ها...</span>
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                {availablePermissions.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    هیچ دسترسی در سیستم تعریف نشده است.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availablePermissions?.map((perm) => {
                      const isChecked = role.permissions.includes(perm.id);
                      const isEditing = editingPermId === perm.id;

                      return (
                        <div
                          key={perm.id}
                          className={`flex items-start justify-between p-3 rounded-lg border transition-all duration-200 ${
                            isChecked
                              ? "bg-blue-500/10 border-blue-500/40"
                              : "bg-black/20 border-white/5 hover:border-white/10"
                          }`}
                        >
                          {isEditing ? (
                            <div className="flex-1 flex flex-col gap-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                                placeholder="نام دسترسی"
                              />
                              <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="توضیحات"
                              />
                              <div className="flex gap-2 mt-1">
                                <button
                                  type="button"
                                  onClick={() => saveEdit(perm.id)}
                                  className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded transition-colors"
                                >
                                  تایید
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="bg-gray-600 hover:bg-gray-500 text-white text-xs px-3 py-1 rounded transition-colors"
                                >
                                  انصراف
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <label className="flex items-start gap-3 cursor-pointer flex-1">
                                <div className="pt-1">
                                  <Checkbox
                                    checked={isChecked}
                                    onToggle={() => togglePermission(perm.id)}
                                  />
                                </div>
                                <div className="flex flex-col select-none">
                                  <span
                                    className={`text-sm font-medium ${
                                      isChecked ? "text-blue-100" : "text-gray-300"
                                    }`}
                                  >
                                    {perm.name}
                                  </span>
                                  {perm.description && (
                                    <span className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                      {perm.description}
                                    </span>
                                  )}
                                </div>
                              </label>

                              <button
                                type="button"
                                onClick={() => startEdit(perm)}
                                className="text-gray-500 hover:text-blue-400 transition-colors px-2"
                                title="ویرایش دسترسی"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              ذخیره نقش
            </button>
          </div>
        </form>
      </div>
      <GiveAllRoles refreshFlag={refreshRolesFlag} />
    </div>
  );
}
