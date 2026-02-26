"use client";

import { useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        router.push(`/auth/sign-in?error=${error}`);
        return;
      }

      if (token) {
        // Usamos el provider de credentials para "loguear" el token recibido del backend
        const result = await signIn("credentials", {
          token,
          redirect: false,
        });

        if (result?.error) {
          router.push(`/auth/sign-in?error=${result.error}`);
        } else {
          router.push("/auth/sign-in");
        }
      }
    };

    run();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600 dark:text-zinc-400 font-medium">
        Finalizando autenticación...
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
