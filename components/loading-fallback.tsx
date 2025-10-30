export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <section className="relative h-[calc(100vh-70px)] md:h-[calc(100vh-90px)] flex items-center overflow-hidden bg-gradient-to-r from-[#001B55]/95 via-[#001B55]/80 to-[#001B55]/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto lg:mx-0 space-y-6">
            {/* Badge skeleton */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-[#FF9C04] rounded-full animate-pulse"></div>
              <div className="h-4 w-40 bg-white/20 rounded animate-pulse"></div>
            </div>

            {/* Title skeleton */}
            <div className="space-y-3">
              <div className="h-12 md:h-16 w-3/4 bg-white/20 rounded-xl animate-pulse"></div>
              <div className="h-10 md:h-14 w-1/2 bg-white/20 rounded-xl animate-pulse"></div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-2 pt-2">
              <div className="h-5 w-full max-w-2xl bg-white/20 rounded animate-pulse"></div>
              <div className="h-5 w-4/5 max-w-xl bg-white/20 rounded animate-pulse"></div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="h-12 w-full sm:w-48 bg-[#FF9C04]/30 rounded-xl animate-pulse"></div>
              <div className="h-12 w-full sm:w-48 bg-white/20 rounded-xl animate-pulse"></div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 bg-[#FF9C04]/30 rounded animate-pulse"></div>
                    <div className="h-8 w-16 bg-white/20 rounded animate-pulse"></div>
                  </div>
                  <div className="h-3 w-24 bg-white/20 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FF9C04]/10 rounded-full px-5 py-2 mb-4">
              <div className="w-2 h-2 bg-[#FF9C04] rounded-full animate-pulse"></div>
              <div className="h-4 w-24 bg-[#FF9C04]/20 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-2/3 max-w-md mx-auto bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
            <div className="h-5 w-4/5 max-w-2xl mx-auto bg-gray-100 rounded animate-pulse"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Video skeleton */}
            <div className="relative">
              <div className="w-full h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 border-2 border-[#001B55]/20 shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#001B55]/10 rounded-lg animate-pulse"></div>
                      <div className="w-full space-y-2">
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section Skeleton */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FF9C04]/10 rounded-full px-5 py-2 mb-4">
              <div className="w-2 h-2 bg-[#FF9C04] rounded-full animate-pulse"></div>
              <div className="h-4 w-32 bg-[#FF9C04]/20 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-1/2 max-w-sm mx-auto bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
            <div className="h-5 w-3/4 max-w-2xl mx-auto bg-gray-100 rounded animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#001B55]/20 shadow-lg"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#001B55]/10 rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-[#FF9C04]/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section Skeleton */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FF9C04]/10 rounded-full px-5 py-2 mb-4">
              <div className="w-2 h-2 bg-[#FF9C04] rounded-full animate-pulse"></div>
              <div className="h-4 w-28 bg-[#FF9C04]/20 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-1/3 max-w-xs mx-auto bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
            <div className="h-5 w-2/3 max-w-xl mx-auto bg-gray-100 rounded animate-pulse"></div>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-3 shadow-xl border-2 border-[#001B55]/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-28 bg-[#FF9C04]/20 rounded-xl animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border-2 border-[#001B55]/20 shadow-lg"
              >
                <div className="w-full h-80 bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
