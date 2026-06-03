import { useState } from "react";
import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const themes = [
        {
            id: "light",
            label: "تم لایت",
            colorClass:
                "bg-white border border-zinc-300",
            previewBg: "bg-white",
            textClass: "text-zinc-800",
            borderClass: "border-zinc-300",
            hoverBg: "hover:bg-zinc-100",
        },
        {
            id: "dark",
            label: "دارک",
            colorClass:
                "bg-zinc-900 border border-zinc-600",
            previewBg: "bg-zinc-900",
            textClass: "text-zinc-900",
            borderClass: "border-zinc-700",
            hoverBg: "hover:bg-zinc-800",
        },
        {
            id: "green",
            label: "سبز",
            colorClass:
                "bg-emerald-500 border border-emerald-300",
            previewBg: "bg-emerald-500",
            textClass: "text-emerald-500",
            borderClass: "border-emerald-500",
            hoverBg: "hover:bg-emerald-600",
        },
    ];

    const currentTheme = themes.find((t) => t.id === theme) ?? themes[0];

    const handleSelect = (id: string) => {
        setTheme(id as any);
        setOpen(false);
    };

    return (
        <div className="relative w-48 text-right">

            <button
                type="button"
                className={`
          w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm
          bg-white border-zinc-300 text-zinc-800
          hover:bg-zinc-100 transition-colors
        `}
                onClick={() => setOpen((prev) => !prev)}
            >
                <div className="flex items-center gap-2">

                    <span
                        className={`
              inline-flex h-4 w-4 items-center justify-center rounded-full
              ${currentTheme.colorClass}
            `}
                    />
                    <span>{currentTheme.label}</span>
                </div>


                <span
                    className={`transition-transform duration-150 ${open ? "rotate-180" : "rotate-0"
                        }`}
                >
                    ▼
                </span>
            </button>

            {open && (
                <div
                className="
                absolute bottom-full mb-2 
                w-full rounded-xl border border-zinc-200 bg-white shadow-lg
                z-20 overflow-hidden z-50
                "
                >
                    <ul className="py-1">
                        {themes.map((item) => (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(item.id)}
                                    className={`
                    w-full flex items-center justify-between gap-2 px-3 py-2 text-sm
                    ${item.textClass}
                    ${item.hoverBg}
                    transition-colors
                    ${theme === item.id ? "bg-zinc-100/80" : ""}
                  `}
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`
                        inline-flex h-4 w-4 items-center justify-center rounded-full
                        ${item.colorClass}
                      `}
                                        />
                                        <span>{item.label}</span>
                                    </div>

                                    {theme === item.id && (
                                        <span className="text-xs text-emerald-500 font-semibold">
                                            فعال
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
