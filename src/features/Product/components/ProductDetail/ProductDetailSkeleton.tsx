export default function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5">
        {[80, 64, 56, 160].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <div className="w-2 h-2 bg-slate-100 rounded-full" />}
            <div className={`h-3 bg-slate-100 rounded`} style={{ width: w }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image area */}
        <div>
          <div className="aspect-square bg-slate-100 rounded-2xl mb-3" />
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-14 h-14 bg-slate-100 rounded-lg flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Info area */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-slate-100 rounded-lg" />
            <div className="h-6 w-16 bg-slate-100 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-slate-100 rounded w-full" />
            <div className="h-5 bg-slate-100 rounded w-4/5" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-40" />
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-4 bg-slate-100 rounded w-10" />
          <div className="flex gap-2">
            {[3, 4].map((i) => (
              <div key={i} className="h-7 w-16 bg-slate-100 rounded-full" />
            ))}
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="h-11 bg-slate-100 rounded-xl" />
            <div className="h-11 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}