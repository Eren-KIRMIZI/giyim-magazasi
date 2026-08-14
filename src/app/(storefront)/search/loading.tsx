export default function SearchLoading() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="flex flex-col md:flex-row gap-gutter">
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="h-6 w-32 bg-surface-variant animate-pulse mb-stack-md" />
          <div className="h-3 w-20 bg-surface-variant animate-pulse mb-3" />
          <div className="h-3 w-full bg-surface-variant animate-pulse mb-2" />
          <div className="h-3 w-3/4 bg-surface-variant animate-pulse mb-2" />
          <div className="h-3 w-2/3 bg-surface-variant animate-pulse" />
        </div>
        <section className="flex-1 w-full">
          <div className="h-12 w-full bg-surface-variant animate-pulse mb-stack-md" />
          <div className="h-8 w-40 bg-surface-variant animate-pulse mb-stack-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-on-surface/20">
                <div className="aspect-[4/5] bg-surface-variant animate-pulse" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 w-3/4 bg-surface-variant animate-pulse" />
                  <div className="h-6 w-16 bg-on-surface/20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
