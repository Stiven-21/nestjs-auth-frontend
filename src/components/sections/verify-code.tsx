"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  onSubmit: (code: string) => Promise<void>;
  qrImageUrl?: string; // opcional (base64 o URL)
  err?: string | null;
};

export default function VerificationCodeForm({
  onSubmit,
  qrImageUrl,
  err = null,
}: Props) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(err);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const upperValue = value.toUpperCase();
    if (!/^[A-Z0-9]?$/.test(upperValue)) return;

    const newCode = [...code];
    newCode[index] = upperValue;
    setCode(newCode);

    if (upperValue && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCode = code.join("");
    if (finalCode.length !== 6) {
      setError("Ingresa el código completo de 6 dígitos");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(finalCode);
    } catch {
      setError("El código es inválido o ha expirado");
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
          Verificación de seguridad
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Ingresa el código de 6 dígitos para continuar.
        </p>
      </div>

      {/* QR opcional */}
      {qrImageUrl && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Image
            src={qrImageUrl}
            alt="Código QR de verificación"
            width={20}
            height={20}
            className="
              h-40 w-40 rounded-xl
              border border-slate-200 dark:border-slate-700
              bg-white p-2
            "
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Escanea el código con tu app de autenticación
          </p>
        </motion.div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Inputs OTP */}
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="
                h-12 w-10 text-center text-lg font-semibold
                rounded-xl
                bg-slate-50 dark:bg-slate-800
                border border-slate-300 dark:border-slate-700
                text-slate-900 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-slate-400
              "
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-center text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}

        {/* Action */}
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
          {loading ? "Verificando…" : "Confirmar código"}
        </button>
      </form>
    </motion.div>
  );
}
