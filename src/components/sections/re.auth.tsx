"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  onSubmit: (password: string) => Promise<void>;
};

const ReAuthForm = ({ onSubmit }: Props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("La contraseña es obligatoria");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(password);
    } catch {
      setError("La contraseña es incorrecta o la sesión expiró");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        w-full max-w-md rounded-2xl
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        shadow-sm
        p-6 space-y-6
      "
    >
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Confirmar identidad
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Por seguridad, ingresa tu contraseña para continuar.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full rounded-xl px-4 py-2
              bg-slate-50 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              text-slate-900 dark:text-slate-100
              placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-slate-400
            "
            placeholder="••••••••"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        )}

        {/* Actions */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full rounded-xl px-4 py-2
            bg-slate-900 text-slate-50
            hover:bg-slate-800
            dark:bg-slate-100 dark:text-slate-900
            dark:hover:bg-slate-200
            transition
            font-medium
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? "Verificando…" : "Confirmar"}
        </button>
      </form>
    </motion.div>
  );
};

export default ReAuthForm;
