"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  memo,
} from "react";
import ClickOutSide from "@/common/ClickOutSide/clickOutSide";
import { themeOptions } from "@/data/theme.data";
import { useTheme } from "@/provider/theme.provider";
import { useAppTranslations } from "@/hooks/useAppTranslations";

const SelectTheme = () => {
  const [theme, setTheme] = useTheme();
  const [isPending, startTransition] = useTransition();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const { t_theme } = useAppTranslations();

  useEffect(() => {
    if (!showDropdown) return;

    const dropdown = dropdownRef.current;
    if (dropdown) {
      const rect = dropdown.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDropUp(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
  }, [showDropdown]);

  const handleChangeTheme = useCallback(
    (tm: "light" | "dark" | "system") => {
      if (isPending || theme === tm) return;
      startTransition(() => setTheme(tm));
      setShowDropdown(false);
    },
    [isPending, theme, setTheme],
  );

  const selectedThemeOption =
    themeOptions.find((t) => t.value === theme) || themeOptions[0];

  return (
    <ClickOutSide
      onclick={() => setShowDropdown(false)}
      className="relative"
    >
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-between cursor-pointer w-full px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-950 dark:text-slate-50"
      >
        <span className="flex items-center">{selectedThemeOption.icon}</span>
      </button>

      <ul
        ref={dropdownRef}
        className={`absolute z-10 w-30 right-0 overflow-hidden rounded-sm bg-slate-50 dark:bg-gray-800 shadow-md duration-300 ease-linear ${
          dropUp ? "bottom-full mb-2" : "top-full mt-2"
        } ${
          showDropdown
            ? "max-h-60 border border-gray-300 dark:border-gray-700"
            : "max-h-0 border-0"
        }`}
      >
        {themeOptions.map((t) => (
          <li key={t.value}>
            <button
              onClick={() => handleChangeTheme(t.value)}
              className={`w-full cursor-pointer px-4 py-2 flex items-center gap-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700 ${
                t.value === theme
                  ? "text-sky-500"
                  : "text-slate-950 dark:text-slate-50"
              }`}
            >
              {t.icon}
              {t_theme(t.value.toUpperCase())}
            </button>
          </li>
        ))}
      </ul>
    </ClickOutSide>
  );
};

export default memo(SelectTheme);
