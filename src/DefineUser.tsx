// RoleForm.tsx
import { useState } from "react";
import TextInput from "./shared/Forms/TextInput";
import Checkbox from "./shared/Forms/Checkbox";

const MODULES = ["کاربران", "گزارش‌ها", "تنظیمات", "مالی", "محصولات", "پشتیبانی"];

const STATIC_ACTIONS = [
  { id: "read", label: "خواندن" },
  { id: "write", label: "نوشتن" },
];

interface ActionItem {
  id: string;
  label: string;
  isStatic: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  actions: ActionItem[];
  permissions: Record<string, Record<string, boolean>>;
}

let nextId = 1;
const genId = () => `role-${nextId++}`;

const createDefaultRole = (): Role => {
  const actions: ActionItem[] = STATIC_ACTIONS.map(a => ({ ...a, isStatic: false }));
  console.log(actions);

  const perms: Record<string, Record<string, boolean>> = {};
  MODULES.forEach(mod => {
    perms[mod] = {};
    actions.forEach(a => { perms[mod][a.id] = false; });
  });
  return {
    id: genId(),
    name: "",
    description: "",
    actions,
    permissions: perms,
  };
};

export default function DefineRole() {
  const [roles, setRoles] = useState<Role[]>([createDefaultRole()]);
  const [selectedId, setSelectedId] = useState<string>(roles[0].id);
  const [newActionLabel, setNewActionLabel] = useState("");

  const selectedRole = roles.find(r => r.id === selectedId) ?? roles[0];


  const updateSelected = (updater: (role: Role) => Role) => {
    setRoles(prev =>
      prev.map(r => (r.id === selectedId ? updater(r) : r))
    );
  };

  const handleNameChange = (name: string) => updateSelected(r => ({ ...r, name }));
  const handleDescChange = (desc: string) => updateSelected(r => ({ ...r, description: desc }));

  const addAction = () => {
    const label = newActionLabel.trim();
    if (!label) return;
    const id = label.replace(/\s+/g, "_").toLowerCase();
    if (selectedRole.actions.some(a => a.id === id)) return;

    updateSelected(role => {
      const newAction: ActionItem = { id, label, isStatic: false };
      const actions = [...role.actions, newAction];
      const permissions = { ...role.permissions };
      MODULES.forEach(mod => {
        permissions[mod] = { ...permissions[mod], [id]: false };
      });
      return { ...role, actions, permissions };
    });
    setNewActionLabel("");
  };

  const removeAction = (actionId: string) => {
    updateSelected(role => {
      const actions = role.actions.filter(a => a.id !== actionId);
      const permissions = { ...role.permissions };
      MODULES.forEach(mod => {
        const { [actionId]: _, ...rest } = permissions[mod];
        permissions[mod] = rest;
      });
      return { ...role, actions, permissions };
    });
  };

  const togglePerm = (mod: string, act: string) => {
    updateSelected(role => ({
      ...role,
      permissions: {
        ...role.permissions,
        [mod]: {
          ...role.permissions[mod],
          [act]: !role.permissions[mod][act]
        },
      },
    }));
  };



  const toggleModule = (mod: string) => {
    updateSelected(role => {
      const allOn = role.actions.every(a => role.permissions[mod][a.id]);
      const newModPerms: Record<string, boolean> = {};
      role.actions.forEach(a => { newModPerms[a.id] = !allOn; });
      return {
        ...role,
        permissions: {
          ...role.permissions,
          [mod]: newModPerms
        },
      };
    });
  };

  const addRole = () => {
    const newRole = createDefaultRole();
    setRoles(prev => [...prev, newRole]);
    setSelectedId(newRole.id);
  };

  const removeRole = (id: string) => {
    if (roles.length <= 1) return;
    setRoles(prev => prev.filter(r => r.id !== id));
    if (selectedId === id) {
      setSelectedId(roles.filter(r => r.id !== id)[0]?.id ?? "");
    }
  };

  const actions = selectedRole.actions;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-3xl bg-black/60 border border-blue-500/30 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">

        <h2 className="text-xl font-bold text-blue-400 border-b border-blue-500/20 pb-3">
          مدیریت نقش‌های کاربری
        </h2>

        <div className="flex flex-wrap gap-2 items-start">
          {roles.map(role => (
            <div key={role.id} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedId(role.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                  ${role.id === selectedId
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  }`}
              >
                {role.name || "نقش جدید"}
              </button>
              {roles.length > 1 && (
                <button
                  onClick={() => removeRole(role.id)}
                  className="text-red-400 hover:text-red-300 px-1 text-sm cursor-pointer"
                  title="حذف نقش"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addRole}
            className="px-3 py-1.5 rounded-lg text-sm bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 cursor-pointer"
          >
            ＋ افزودن نقش
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex gap-3 flex-wrap">
            <TextInput
              value={selectedRole.name}
              onValueChange={handleNameChange}
              placeholder="نام نقش"
              className="flex-1"
            />
            <TextInput
              value={selectedRole.description}
              onValueChange={handleDescChange}
              placeholder="توضیحات (اختیاری)"
              className="flex-[2]"
            />
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-300">دسترسی های این نقش</h3>
            <div className="flex flex-wrap gap-2">
              {actions.map(act => (
                <div
                  key={act.id}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border
                    ${act.isStatic
                      ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
                      : "bg-white/5 border-gray-600 text-gray-300"
                    }`}
                >
                  <span>{act.label}</span>
                  {!act.isStatic && (
                    <button
                      onClick={() => removeAction(act.id)}
                      className="text-red-400 hover:text-red-300 text-xs ml-1 cursor-pointer"
                      title="حذف اکشن"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <input
                value={newActionLabel}
                onChange={(e) => setNewActionLabel(e.target.value)}
                placeholder="دسترسی جدید را وارد نمایید"
                className="bg-white/10 border border-white/10 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') addAction(); }}
              />
              <button
                onClick={addAction}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-1.5 rounded cursor-pointer"
              >
                افزودن
              </button>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10">
            <div
              className="grid bg-white/5 px-4 py-2 text-sm text-gray-400 font-medium"
              style={{ gridTemplateColumns: `1fr repeat(${actions.length}, 1fr)` }}
            >
              <span>ماژول</span>
              {actions.map(a => (
                <span key={a.id} className="text-center">{a.label}</span>
              ))}
            </div>

            {MODULES.map((mod, i) => {
              const allOn = actions.every(a => selectedRole.permissions[mod][a.id]);
              return (
                <div
                  key={mod}
                  className={`grid items-center px-4 py-3 transition-colors
                    ${i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}
                    hover:bg-blue-500/5`}
                  style={{ gridTemplateColumns: `1fr repeat(${actions.length}, 1fr)` }}
                >
                  <button
                    type="button"
                    onClick={() => toggleModule(mod)}
                    className={`text-right text-sm font-medium transition-colors
                      ${allOn ? "text-blue-400" : "text-gray-300"}`}
                  >
                    {mod}
                  </button>

                  {actions.map(act => {
                    const on = selectedRole.permissions[mod][act.id];
                    return (
                      <div key={act.id} className="flex justify-center">
                        <Checkbox
                          checked={selectedRole.permissions[mod][act.id]}
                          onToggle={() => togglePerm(mod, act.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => console.log("Saved roles:", roles)}
            className="self-end bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-2 rounded-lg transition-colors cursor-pointer"
          >
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );
}