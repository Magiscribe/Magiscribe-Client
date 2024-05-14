export function SectionTemplate({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-white py-8">
      <div className="container max-w-6xl mx-auto flex flex-wrap pt-4 pb-12">
        {children}
      </div>
    </section>
  );
}
