import { motion } from "framer-motion";

export default function LoadingState() {
  return (
    <>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="mx-auto h-12 w-12 rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-100"
      />

      <p className="text-slate-600 dark:text-slate-400">
        Verificando tu correo…
      </p>
    </>
  );
}
