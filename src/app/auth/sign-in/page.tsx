"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { IoMail } from "react-icons/io5";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaFacebookF,
} from "react-icons/fa";
import AuthNavbar from "@/components/layout/AuthNavbar";
import { toast } from "react-toastify";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { API_URL } from "@/common/constants/api.constant";
import { login, verify2FA } from "@/services/auth/auth-post.service";
import { ApiError } from "@/interfaces/api.interface";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import VerificationCodeForm from "@/components/sections/verify-code";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null); //luego cambiar por un token temporal
  const { t_auth } = useAppTranslations();

  async function handleCredentialsLogin(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setLoading("credentials");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    let loginResult: null | Awaited<ReturnType<typeof login>> = null;
    try {
      loginResult = await login({ email, password });
    } catch (error) {
      if (error instanceof ApiError) {
        if (
          error.code === "USER_NOT_FOUND" ||
          error.code === "INVALID_PASSWORD"
        ) {
          const TOAST_ID = "INVALID_CREDENTIALS";
          if (toast.isActive(TOAST_ID)) {
            toast.update(TOAST_ID, {
              render: t_auth("INVALID_CREDENTIALS"),
              autoClose: 3000,
            });
          } else {
            toast.error(t_auth("INVALID_CREDENTIALS"), {
              position: "top-center",
              toastId: "INVALID_CREDENTIALS",
              autoClose: 3000,
            });
          }
        }
      }
      setLoading(null);
    }

    if (!loginResult?.data && loginResult?.meta?.twoFactorRequired) {
      setUserId(Number(loginResult?.meta?.sub));
      setModal(true);
      setLoading(null);
      return;
    }

    const result = await signIn("credentials", {
      token: loginResult?.data?.refreshToken,
      redirect: false,
    });

    if (result?.error) {
      const TOAST_ID = "INVALID_CREDENTIALS";
      if (toast.isActive(TOAST_ID)) {
        toast.update(TOAST_ID, {
          render: t_auth("INVALID_CREDENTIALS"),
          autoClose: 3000,
        });
      } else {
        toast.error(
          result.error === "CredentialsSignin"
            ? t_auth("INVALID_CREDENTIALS")
            : result.error,
          {
            position: "top-center",
            toastId: "INVALID_CREDENTIALS",
            autoClose: 3000,
          },
        );
      }
      setLoading(null);
    } else {
      setLoading(null);
      toast.success("Bienvenido");
      router.push(callbackUrl);
    }
  }

  const handleOAuthLogin = (provider: string) => {
    setLoading(provider);
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  const handleVerify = async (code: string) => {
    let data: null | Awaited<ReturnType<typeof verify2FA>> = null;
    try {
      data = await verify2FA({ code, userId: userId as number });
      console.log(data);
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.code);
        return;
      }
    }

    const result = await signIn("credentials", {
      token: data?.data?.refreshToken,
      redirect: false,
    });

    if (result?.error) {
      const TOAST_ID = "INVALID_CREDENTIALS";
      if (toast.isActive(TOAST_ID)) {
        toast.update(TOAST_ID, {
          render: t_auth("INVALID_CREDENTIALS"),
          autoClose: 3000,
        });
      } else {
        toast.error(
          result.error === "CredentialsSignin"
            ? t_auth("INVALID_CREDENTIALS")
            : result.error,
          {
            position: "top-center",
            toastId: "INVALID_CREDENTIALS",
            autoClose: 3000,
          },
        );
      }
      setLoading(null);
    } else {
      setLoading(null);
      toast.success("Bienvenido");
      router.push(callbackUrl);
    }
  };

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-slate-950">
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              className="space-y-6"
              onSubmit={handleCredentialsLogin}
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    className="w-full mb-1 pl-10 pr-10 py-3 placeholder:tracking-widest tracking-wider rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition"
                  />
                  <div className="absolute right-3 top-4">
                    {showPassword ? (
                      <FaEyeSlash
                        className=" w-5.5 h-5.5 text-slate-400 dark:text-slate-500 cursor-pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <FaEye
                        className=" w-5 h-5 text-slate-400 dark:text-slate-500 cursor-pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end mb-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:text-blue-700 dark:focus:text-blue-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all shadow-lg ${loading === "credentials" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {loading === "credentials" ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs text-slate-400 dark:text-slate-500">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleOAuthLogin("google")}
                disabled={!!loading}
                className="py-3 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 border cursor-pointer border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium text-slate-700 dark:text-slate-300 disabled:opacity-50"
              >
                <FaGoogle className="w-5 h-5 mr-2" />
                <span className="sr-only lg:not-sr-only">Google</span>
              </button>
              <button
                onClick={() => handleOAuthLogin("github")}
                disabled={!!loading}
                className="py-3 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 border cursor-pointer border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium text-slate-700 dark:text-slate-300 disabled:opacity-50"
              >
                <FaGithub className="w-5 h-5 mr-2" />
                <span className="sr-only lg:not-sr-only">GitHub</span>
              </button>
              <button
                onClick={() => handleOAuthLogin("facebook")}
                disabled={!!loading}
                className="py-3 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 border cursor-pointer border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium text-slate-700 dark:text-slate-300 disabled:opacity-50"
              >
                <FaFacebookF className="w-5 h-5 mr-2" />
                <span className="sr-only lg:not-sr-only">Facebook</span>
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
              Dont have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
            © 2024 FinanceApp Inc. All rights reserved. Your data is encrypted
            with bank-level security.
          </p>
        </div>
        <Modal
          isOpen={modal}
          onClose={() => {
            setModal(false);
          }}
          size="xl"
          position="center"
          backdropClass="backdrop-blur-md"
          isDismissable={false}
        >
          <ModalHeader>
            {/* <ModalTitle></ModalTitle> */}
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody className="overflow-y-auto max-h-96">
            <VerificationCodeForm onSubmit={handleVerify} />
          </ModalBody>

          <ModalFooter>Footer</ModalFooter>
        </Modal>
      </div>
    </>
  );
}
