export default function PostListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-start gap-4">
            {/* Vote buttons skeleton */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              {/* Title skeleton */}
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              
              {/* Tags skeleton */}
              <div className="flex gap-2">
                <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
              </div>
              
              {/* Meta info skeleton */}
              <div className="flex gap-4">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
