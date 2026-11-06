interface StarRatingProps {
  rating: number;
  size?: "sm" | "lg";
}


export default function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const px = size === "lg" ? "text-base" : "text-[13px]";
  return (
    <div className={`flex items-center gap-0.5 ${px}`} aria-label={`${rating} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled  = rating >= i;
        const half    = !filled && rating >= i - 0.5;
        return (
          <svg
            key={i}
            className={`w-[1em] h-[1em] ${filled || half ? "text-amber-500" : "text-slate-200"}`}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : half ? "url(#half)" : "none"}
            stroke="currentColor"
            strokeWidth={filled || half ? 0 : 1.5}
            aria-hidden="true"
          >
            {half && (
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M11.048 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        );
      })}
    </div>
  );
}