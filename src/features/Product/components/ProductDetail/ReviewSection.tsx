import StarRating from "./StarRating";
import { MOCK_REVIEWS, MOCK_RATING_SUMMARY,} from "../../constants/mockReview";
import { formatDate } from "../../utils/productFormat";

export default function ReviewSection() {

  return (
  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm mb-6 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Đánh giá sản phẩm</h2>

        {/* Summary */}
        <div className="flex items-start gap-5 bg-slate-50 rounded-xl p-4 mb-5">
          {/* Big number */}
          <div className="flex flex-col items-center flex-shrink-0">
            <span className="text-4xl font-bold text-slate-800 leading-none">
              {MOCK_RATING_SUMMARY.average}
            </span>
            <div className="my-1.5">
              <StarRating rating={MOCK_RATING_SUMMARY.average} size="lg" />
            </div>
            <span className="text-[11px] text-slate-400">
              {MOCK_RATING_SUMMARY.total} đánh giá
            </span>
          </div>

          {/* Bars */}
          <div className="flex-1 space-y-1.5" role="list" aria-label="Phân bổ đánh giá">
            {MOCK_RATING_SUMMARY.distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-[11px]" role="listitem">
                <span className="text-slate-500 w-4">{d.star}★</span>
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-slate-400 w-5 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-3">
          {MOCK_REVIEWS.map((rev) => (
            <article
              key={rev.id}
              className="border border-slate-100 rounded-xl p-4"
              aria-label={`Đánh giá của ${rev.name}`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {rev.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-700">{rev.name}</span>
                    {rev.verified && (
                      <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Đã mua
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 ml-auto">
                      {formatDate(rev.date ?? "")}
                    </span>
                  </div>
                  <StarRating rating={rev.rating} />
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{rev.text}</p>
            </article>
          ))}
        </div>

        {/* Load more hint */}
        <button className="w-full mt-4 h-9 border border-slate-200 hover:border-violet-300 text-xs text-slate-500 hover:text-violet-600 rounded-xl transition-colors">
          Xem tất cả {MOCK_RATING_SUMMARY.total} đánh giá
        </button>
      </div>
  );
}
