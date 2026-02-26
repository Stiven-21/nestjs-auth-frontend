import { motion } from "framer-motion";

export function Illustration({ type }: { type: "success" | "error" }) {
  const color = type === "success" ? "text-emerald-500" : "text-rose-500";

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      className={`mx-auto ${color}`}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
      >
        <circle
          cx="60"
          cy="60"
          r="48"
          stroke="currentColor"
          strokeWidth="6"
        />
        {type === "success" ? (
          <path
            d="M40 62l12 12 28-28"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M45 45l30 30M75 45l-30 30"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
        )}
      </svg>
    </motion.div>
  );
}
