"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl text-center space-y-8"
      >
        {/* Ilustración SVG */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center"
        >
          <svg
            width="240"
            height="240"
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-slate-400 dark:text-slate-600"
          >
            <defs>
              <linearGradient
                id="ringGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="currentColor"
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.3"
                />
              </linearGradient>
            </defs>

            {/* Círculo exterior */}
            <circle
              cx="120"
              cy="120"
              r="96"
              stroke="url(#ringGradient)"
              strokeWidth="6"
            />

            {/* Ojos */}
            <circle
              cx="95"
              cy="105"
              r="6"
              fill="currentColor"
            />
            <circle
              cx="145"
              cy="105"
              r="6"
              fill="currentColor"
            />

            {/* Boca neutral (no triste) */}
            <path
              d="M90 145c20 10 40 10 60 0"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </motion.div>

        {/* Código */}
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100"
        >
          404
        </motion.h1>

        {/* Copy */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">
            Parece que esta página se perdió
          </h2>

          <p className="text-slate-600 dark:text-slate-400">
            No encontramos el recurso que estás buscando. Puede que la URL sea
            incorrecta o que el contenido ya no esté disponible.
          </p>
        </div>

        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex justify-center"
        >
          <Link
            href="/"
            className="
              inline-flex items-center justify-center
              rounded-xl px-6 py-3
              bg-slate-900 text-slate-50
              hover:bg-slate-800
              dark:bg-slate-100 dark:text-slate-900
              dark:hover:bg-slate-200
              transition-colors duration-200
              font-medium
              focus:outline-none focus-visible:ring
              focus-visible:ring-slate-400
            "
          >
            Volver al inicio
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
