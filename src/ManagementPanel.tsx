import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import homeBlack from "./assets/icons/home-black.svg";
import homeWhite from "./assets/icons/home-white.svg";
import userAvatar from "./assets/panel/User.svg";
import api from "./api/api";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  {
    to: "/",
    end: true,
    label: "خانه",
    iconActive: homeBlack,
    iconInactive: homeWhite,
    iconAlt: "خانه",
  },
  {
    to: "/define-role-user",
    end: false,
    label: "تعریف نقش کاربر",
    iconActive: homeBlack,
    iconInactive: homeWhite,
    iconAlt: "تعریف نقش کاربر",
  },
  {
    to: "/define-user",
    end: false,
    label: "تعریف  کاربر",
    iconActive: homeBlack,
    iconInactive: homeWhite,
    iconAlt: "تعریف  کاربر",
  },
];

export default function ManagementPanel() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = mobileOpen ? "hidden" : prev;
    return () => { document.documentElement.style.overflow = prev; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    if (mobileOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);


  const navClass = (isActive: boolean) =>
    `flex items-center justify-center gap-3 py-2 px-3 rounded-md transition-colors w-full text-sm ${isActive ? "bg-blue-600 text-black font-semibold shadow-inner" : "hover:bg-white/5 active:bg-white/10"
    }`;

  const renderLinks = (onNavigate?: () => void, iconSize = "w-7 h-7", textSize = "text-2xl") =>
    NAV_ITEMS.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={({ isActive }) => navClass(isActive)}
      >
        {({ isActive }) => (
          <>
            <span className={textSize}>{item.label}</span>
            <img
              src={isActive ? item.iconActive : item.iconInactive}
              alt={item.iconAlt}
              className={`${iconSize} flex-shrink-0`} aria-hidden="true"
            />
          </>
        )}
      </NavLink>
    ));

  return (
    <div className="min-h-screen flex flex-row-reverse text-[color:var(--color-text)] select-none bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Sidebar دسکتاپ */}
      <aside className="hidden md:flex md:flex-col w-72 p-6 border-l border-blue-500 bg-black text-white">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="rounded-full p-[2px] bg-blue-500 shadow-lg">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-white/20">
              <img src={userAvatar} alt="عکس کاربر — رضا فروغ نیا" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="font-kalameh-black mt-1 text-center text-3xl text-blue-600">رضا فروغ نیا</p>
        </div>
        <nav className="flex flex-col gap-2 mt-2 items-center" aria-label="منوی مدیریت">
          {renderLinks()}
        </nav>
        <div className="mt-auto pt-4 border-t border-blue-500/30">
          <button onClick={async () => {
            await api.post("/auth/logout").then(() => {
              toast.success("خروج با موفقیت انجام شد")
              navigate("/login")
            }).catch((err) => {
              console.log(err);
              err?.businessStatus==502?toast.error("ارتباط با سرویس دهنده قطع شده"):toast.error(".لطفا در سامانه ثبت نام نمایید")
            })
          }} className="w-full py-3 text-center text-xl text-white hover:bg-blue-500/20 rounded-lg transition-colors !cursor-pointer">
            خروج
          </button>
        </div>
      </aside>


      {/* محتوای اصلی */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-3 border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
              <img src={userAvatar} alt="آواتار" className="w-full h-full object-cover" />
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="باز کردن منو"
            className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
          >
            ☰
          </button>
        </header><main dir="rtl" className="flex-1 overflow-auto">
          <Outlet />
        </main>
        
      </div>

      <div
        className={`fixed inset-0 z-40 transition-opacity ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)} style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"
          } backdrop-blur-md bg-white/10 border-l border-white/20 text-white p-5 shadow-2xl`} role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="بستن منو"
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            >
              ✕
            </button>
            <div className="w-full flex flex-col items-center justify-between mr-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                <img src={userAvatar} alt="عکس کاربر" className="w-full h-full object-cover" />
              </div>
              <span className="font-kalameh-Regular">رضا فروغ نیا</span>
            </div>
            
          </div>
          <div className="border-2 border-blue-500 w-full rounded-2xl" />
          <nav className="flex flex-col gap-2 items-center" aria-label="ناوبری موبایل">
            {renderLinks(() => setMobileOpen(false), "w-6 h-6", "text-base")}
          </nav>
           <button onClick={async () => {
            await api.post("/auth/logout").then(() => {
              toast.success("خروج با موفقیت انجام شد")
              navigate("/login")
            }).catch((err) => {
              console.log(err);
              err?.businessStatus==502?toast.error("ارتباط با سرویس دهنده قطع شده"):toast.error(".لطفا در سامانه ثبت نام نمایید")
            })
          }} className="w-full py-3 text-center text-xl text-white hover:bg-blue-500/20 rounded-lg transition-colors !cursor-pointer">
            خروج
          </button>
        </div>
      </aside>
    </div>
  );
}
