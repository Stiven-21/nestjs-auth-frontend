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
// import { themeOptions } from "@/data/theme.data";
import { languageOptions } from "@/data/language.data";
import { useLanguage } from "@/provider/language.provider";
import { Language } from "@/libs/server/language";
import Flag from "react-world-flags";
import { useAppTranslations } from "@/hooks/useAppTranslations";

const SelectLanguage = () => {
  const [language, setLanguage] = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const { t_language } = useAppTranslations();

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

  const handleChangeLanguage = useCallback(
    (lang: Language) => {
      if (isPending || language === lang) return;
      startTransition(() => setLanguage(lang));
      setShowDropdown(false);
    },
    [isPending, language, setLanguage],
  );

  const selectedLanguageOption = languageOptions.find(
    (option) => option.value === language,
  );

  return (
    <ClickOutSide
      onclick={() => setShowDropdown(false)}
      className="relative"
    >
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-between cursor-pointer w-full px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-950 dark:text-slate-50"
      >
        <span className="flex items-center gap-x-1">
          {selectedLanguageOption?.code}
        </span>
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
        {languageOptions.map((lang) => (
          <li key={lang.value}>
            <button
              onClick={() => handleChangeLanguage(lang.value)}
              className={`w-full cursor-pointer px-4 py-2 flex items-center gap-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700 ${
                lang.value === language
                  ? "text-sky-500"
                  : "text-slate-950 dark:text-slate-50"
              }`}
            >
              <Flag
                code={lang.code}
                height={20}
                width={20}
              />
              {t_language(lang["text-dropdown"])}
            </button>
          </li>
        ))}
      </ul>
    </ClickOutSide>
  );
};

export default memo(SelectLanguage);
