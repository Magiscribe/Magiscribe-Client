export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-700 text-slate-700 dark:text-white container max-w-12xl mx-auto px-6 mb-8 py-8 rounded-2xl shadow-xl border-2">
      {children}
    </div>
  );
}
