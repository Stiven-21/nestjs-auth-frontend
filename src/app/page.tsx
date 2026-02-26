import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Auth v5 + Next.js 15
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tighter">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
              Auth Testing
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Plataforma dedicada exclusivamente a la validación de flujos de
            autenticación OAuth y tradicional.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/sign-in"
            className="w-full sm:w-auto px-10 py-4 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-zinc-500/20"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/auth/sign-up"
            className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors active:scale-95"
          >
            Crear Cuenta
          </Link>
        </div>

        <div className="pt-10 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="font-bold text-sm tracking-widest text-gray-500 dark:text-zinc-500 uppercase">
            Google
          </span>
          <span className="font-bold text-sm tracking-widest text-gray-500 dark:text-zinc-500 uppercase">
            GitHub
          </span>
          <span className="font-bold text-sm tracking-widest text-gray-500 dark:text-zinc-500 uppercase">
            Facebook
          </span>
        </div>
      </div>
    </div>
  );
}
