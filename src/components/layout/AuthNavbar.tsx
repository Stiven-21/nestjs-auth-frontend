"use client";

import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import SelectTheme from "@/components/theme/selectTheme";
import SelectLanguage from "@/components/language/selectLanguage";

export default function AuthNavbar() {
  return (
    <nav className="w-full md:sticky bg-slate-50/90  dark:bg-slate-950/95 backdrop-blur-sm border-b-slate-300 dark:border-b-neutral-800 top-0 left-0 z-50">
      <div className="max-w-8xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-slate-900 dark:text-slate-100 hover:text-blue-400 font-semibold text-lg"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md">
            <FaAngleLeft className="w-5 h-5 " />
          </div>
          Back to Home
          {/* Volver al inicio */}
        </Link>

        {/* Right links */}
        <div className="flex items-center gap-x-1 text-sm font-medium">
          <SelectLanguage />
          <SelectTheme />
        </div>
      </div>
    </nav>
  );
}
