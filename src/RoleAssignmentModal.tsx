// components/RoleAssignmentModal.tsx
import { useState, useEffect } from "react";
import api from "./api/api";
import toast from "react-hot-toast";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Domain {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  domain: Domain;
  permissions: Permission[];
}

interface RoleAssignmentModalProps {
  userId: string;
  onClose: () => void;
  userName?: string;
}

export default function RoleAssignmentModal({
  userId,
  onClose,
  userName,
}: RoleAssignmentModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/rbac/roles");
      setRoles(response.data);
    } catch (error) {
      toast.error("خطا در دریافت نقش‌ها");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (selectedRoleIds.size === 0) {
      toast.error("حداقل یک نقش را انتخاب کنید");
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/rbac/users/${userId}/roles`, {
        roleIds: Array.from(selectedRoleIds),
      });
      toast.success("نقش‌ها با موفقیت تخصیص داده شد");
      onClose();
    } catch (error) {
      toast.error("خطا در تخصیص نقش‌ها");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-blue-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-blue-500/20 flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-semibold">تخصیص نقش‌ها</h2>
            {userName && (
              <p className="text-gray-400 text-sm mt-1">کاربر: {userName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-gray-400 py-12">در حال بارگذاری...</div>
          ) : roles.length === 0 ? (
            <div className="text-center text-gray-400 py-12">نقشی یافت نشد</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => toggleRole(role.id)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedRoleIds.has(role.id)
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedRoleIds.has(role.id)
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-600"
                      }`}
                    >
                      {selectedRoleIds.has(role.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium">{role.name}</h3>
                      {role.description && (
                        <p className="text-gray-400 text-sm mt-1">{role.description}</p>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        دامنه: {role.domain.name}
                      </div>
                      
                      {role.permissions.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-400 mb-2">
                            مجوزها ({role.permissions.length}):
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((perm) => (
                              <span
                                key={perm.id}
                                className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                              >
                                {perm.name}
                              </span>
                            ))}
                            {role.permissions.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                                +{role.permissions.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blue-500/20 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            {selectedRoleIds.size} نقش انتخاب شده
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              انصراف
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || selectedRoleIds.size === 0}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "در حال ارسال..." : "تایید نقش‌های انتخاب شده"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
