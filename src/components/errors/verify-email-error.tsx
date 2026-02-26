import Link from "next/link";
import { Illustration } from "../svg/Ilustration";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <>
      <Illustration type="error" />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        No pudimos verificar tu correo
      </h1>

      <p className="text-slate-600 dark:text-slate-400">
        El enlace puede haber expirado o ya fue utilizado. Puedes intentar
        nuevamente.
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={onRetry}
          className="
            rounded-xl px-6 py-3
            bg-slate-900 text-slate-50
            hover:bg-slate-800
            dark:bg-slate-100 dark:text-slate-900
            dark:hover:bg-slate-200
            transition font-medium
          "
        >
          Reintentar
        </button>

        <Link
          href="/"
          className="rounded-xl px-6 py-3 border border-slate-300 dark:border-slate-700"
        >
          Volver al inicio
        </Link>
      </div>
    </>
  );
}
