export function SectionTemplate({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-white dark:bg-slate-800 py-8 text-slate-800 dark:text-white">
      <div className="container max-w-6xl mx-auto flex flex-wrap pt-4 pb-12">{children}</div>
    </section>
  );
}
