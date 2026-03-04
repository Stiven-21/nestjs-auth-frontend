"use client";

import { useState } from "react";
import { IoMail } from "react-icons/io5";
import AuthNavbar from "@/components/layout/AuthNavbar";
import { toast } from "react-toastify";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { resetPassword } from "@/services/auth/auth-post.service";
import { ApiError } from "@/interfaces/api.interface";

export default function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const { t_auth } = useAppTranslations();

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("credentials");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    let resetPasswordResult: null | Awaited<ReturnType<typeof resetPassword>> =
      null;
    try {
      resetPasswordResult = await resetPassword({ email });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === "USER_NOT_FOUND") {
          const TOAST_ID = "USER_NOT_FOUND";
          if (toast.isActive(TOAST_ID)) {
            toast.update(TOAST_ID, {
              render: t_auth("USER_NOT_FOUND"),
              autoClose: 3000,
            });
          } else {
            toast.error(t_auth("USER_NOT_FOUND"), {
              position: "top-center",
              toastId: "USER_NOT_FOUND",
              autoClose: 3000,
            });
          }
        }
      }
    }

    if (resetPasswordResult?.meta?.action === "SUCCESS_PASSWORD_RESET") {
      toast.success(t_auth("SUCCESS_PASSWORD_RESET"), {
        position: "top-center",
        autoClose: 3000,
      });
    }

    setLoading(null);
  }

  return (
    <>
      <AuthNavbar />
      <div className="min-h-auto relative flex justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-lg px-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/40 rounded-2xl p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Recover your password
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                Enter your email address and we will send you a link to reset
                your password
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              className="space-y-6"
              onSubmit={handleResetPassword}
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <IoMail className="absolute left-3 top-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all shadow-lg ${loading === "credentials" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {loading === "credentials"
                  ? "Sending..."
                  : "Send recovery link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
