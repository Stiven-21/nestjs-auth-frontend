"use client";
import NotFoundPage from "@/components/errors/not-found";
import { Illustration } from "@/components/svg/Ilustration";
import { ApiError } from "@/interfaces/api.interface";
import { verifyEmail } from "@/services/auth/auth-post.service";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingState from "@/components/ui/loading";
import { ErrorState } from "@/components/errors/verify-email-error";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const [verifyng, setVerifying] = useState<boolean>(true);
  const [action, setAction] = useState<string | null>(null);

  const run = useCallback(async () => {
    const { token } = await params;
    try {
      const { meta } = await verifyEmail(token);
      if (meta && meta.action) setAction(meta.action as string);
    } catch (error) {
      if (error instanceof ApiError) setAction(error.code);
    }
    setVerifying(false);
  }, [params]);

  useEffect(() => {
    const load = async () => await run();
    load();
  }, [run]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full text-center flex flex-col items-center space-y-8"
      >
        {verifyng && <LoadingState />}
        {action === "TOKEN_NOT_FOUND" && <NotFoundPage />}
        {action === "UNSUPPORTED_RESPONSE" ||
          (action === "INTERNAL_ERROR" && <ErrorState onRetry={run} />)}
        {action === "SUCCESS_EMAIL_VERIFICATION" && (
          <>
            <Illustration type="success" />

            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Correo verificado exitosamente
            </h1>

            <p className="text-slate-600 dark:text-slate-400">
              Tu dirección de correo ha sido confirmada. Ya puedes acceder a
              todas las funcionalidades de la plataforma.
            </p>

            <Link
              href="/login"
              className="
                inline-flex justify-center rounded-xl px-6 py-3
                bg-slate-900 text-slate-50
                hover:bg-slate-800
                dark:bg-slate-100 dark:text-slate-900
                dark:hover:bg-slate-200
                transition font-medium
              "
            >
              Ir al inicio de sesión
            </Link>
          </>
        )}
      </motion.div>
    </main>
  );
}
