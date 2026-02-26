export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-800 dark:bg-slate-900 border-t border-t-slate-700 dark:border-t-slate-800 py-4">
      <div className="mx-auto text-center text-sm text-slate-500/60 dark:text-slate-500/70">
        &copy; {year === 2025 ? "2025" : `2025 - ${year}`} Consejo comunitario
        AFRO CAIMANENCE. Todos los derechos reservados
      </div>
    </footer>
  );
};
