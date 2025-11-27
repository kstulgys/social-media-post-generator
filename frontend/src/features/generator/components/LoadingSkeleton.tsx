"use client";

export function LoadingSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Generating Posts...</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card-dark overflow-hidden animate-pulse">
            <div className="h-14 bg-zinc-800/50" />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                <div>
                  <div className="h-4 w-24 bg-zinc-800 rounded mb-1.5" />
                  <div className="h-3 w-16 bg-zinc-800/50 rounded" />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-5/6" />
                <div className="h-4 bg-zinc-800 rounded w-4/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
