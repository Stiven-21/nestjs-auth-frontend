"use client";
import NotFoundPage from "@/components/errors/not-found";
import { ApiError } from "@/interfaces/api.interface";
import { validateToken } from "@/services/token/token-get.service";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingState from "@/components/ui/loading";
import { ErrorState } from "@/components/errors/verify-email-error";
import AuthNavbar from "@/components/layout/AuthNavbar";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { resetPasswordToken } from "@/services/auth/auth-post.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const [token, setToken] = useState<string | null>(null);
  const [verifyng, setVerifying] = useState<boolean>(true);
  const [action, setAction] = useState<string | null>(null);
  const [error, setError] = useState<{
    token: string | null;
    resetPassword: string | null;
  }>({ token: null, resetPassword: null });
  const [showPassword, setShowPassword] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const run = useCallback(async () => {
    const { token } = await params;
    try {
      const { meta } = await validateToken(token);
      if (meta) {
        setToken(token);
        setAction(meta.isTokenValid ? "TOKEN_VALID" : "TOKEN_INVALID");
      }
    } catch (error) {
      if (error instanceof ApiError) setAction(error.code);
    }
    setVerifying(false);
  }, [params]);

  useEffect(() => {
    const load = async () => await run();
    load();
  }, [run]);

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError({ ...error, token: "TOKEN_NOT_FOUND" });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const password_confirm = formData.get("confirmPassword") as string;

    let resetPasswordResult: null | Awaited<
      ReturnType<typeof resetPasswordToken>
    > = null;
    setLoading(true);
    setError({ ...error, resetPassword: null });
    try {
      resetPasswordResult = await resetPasswordToken(token, {
        password,
        password_confirm,
      });
      if (resetPasswordResult.meta?.action === "SUCCESS_PASSWORD_RESET") {
        toast.success("Password reset successfully", {
          position: "top-center",
          toastId: resetPasswordResult.meta?.action,
          autoClose: 3000,
        });
        router.push("/auth/sign-in");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        const message = error.message.split("|");
        for (const msg of message) {
          toast.error(msg, {
            position: "top-center",
            toastId: msg,
            autoClose: 3000,
          });
        }
      }
    }

    setLoading(false);
    setError({
      ...error,
      resetPassword: null,
    });
  }

  if (action === "TOKEN_VALID")
    return (
      <>
        <AuthNavbar />
        <div className="min-h-auto relative flex justify-center bg-slate-50 dark:bg-slate-950">
          <div className="w-full max-w-lg px-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/40 rounded-2xl p-8">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Welcome Back
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                  Access your investment dashboard securely
                </p>
              </div>

              {error && error.resetPassword && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error.resetPassword}
                </div>
              )}

              {/* Form */}
              <form
                className="space-y-6"
                onSubmit={handleResetPassword}
              >
                {/* Password */}
                <div>
                  <div className="flex items-center justify-start mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword.password ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      required
                      className="w-full mb-1 pl-10 pr-10 py-3 placeholder:tracking-widest tracking-wider rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition"
                    />
                    <div className="absolute right-3 top-4">
                      {showPassword && showPassword.password ? (
                        <FaEyeSlash
                          className=" w-5.5 h-5.5 text-slate-400 dark:text-slate-500 cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              password: false,
                            })
                          }
                        />
                      ) : (
                        <FaEye
                          className=" w-5 h-5 text-slate-400 dark:text-slate-500 cursor-pointer"
                          onClick={() =>
                            setShowPassword({ ...showPassword, password: true })
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Password repeat */}
                <div>
                  <div className="flex items-center justify-start mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password Repeat
                    </label>
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      required
                      className="w-full mb-1 pl-10 pr-10 py-3 placeholder:tracking-widest tracking-wider rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition"
                    />
                    <div className="absolute right-3 top-4">
                      {showPassword && showPassword.confirmPassword ? (
                        <FaEyeSlash
                          className=" w-5.5 h-5.5 text-slate-400 dark:text-slate-500 cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              confirmPassword: false,
                            })
                          }
                        />
                      ) : (
                        <FaEye
                          className=" w-5 h-5 text-slate-400 dark:text-slate-500 cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              confirmPassword: true,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all shadow-lg ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {loading ? "Signing in..." : "Sign In →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full text-center flex flex-col items-center space-y-8"
      >
        {verifyng && <LoadingState />}
        {action === "TOKEN_INVALID" && <NotFoundPage />}
        {action === "UNSUPPORTED_RESPONSE" ||
          (action === "INTERNAL_ERROR" && <ErrorState onRetry={run} />)}
      </motion.div>
    </main>
  );
}
