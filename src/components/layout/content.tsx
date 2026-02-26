const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full relative min-h-96 rounded-sm border border-slate-100 dark:border-gray-800 bg-white shadow-md dark:bg-gray-800">
      {children}
    </section>
  );
};

export default Content;
