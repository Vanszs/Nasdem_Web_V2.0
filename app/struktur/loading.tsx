export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-nasdem-blue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="h-10 w-2/3 bg-white/20 rounded animate-pulse mb-4" />
          <div className="h-6 w-1/2 bg-white/10 rounded animate-pulse" />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-1/2 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-5 w-2/3 mx-auto bg-gray-100 rounded animate-pulse" />
          </div>

          <div className="text-center mb-12">
            <div className="inline-block p-8 bg-white border-2 border-nasdem-blue/20 shadow-xl rounded-2xl">
              <div className="space-y-4">
                <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 animate-pulse" />
                <div className="h-6 w-48 mx-auto bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-40 mx-auto bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="p-6 text-center border-2 border-nasdem-blue/20 shadow-lg rounded-2xl bg-white"
              >
                <div className="space-y-4">
                  <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 animate-pulse" />
                  <div className="h-5 w-40 mx-auto bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 mx-auto bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 border-2 border-nasdem-blue/20 shadow-lg rounded-2xl bg-white"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-nasdem-orange rounded-full" />
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-nasdem-blue/20">
            <div className="h-8 w-1/3 mx-auto bg-gray-200 rounded animate-pulse mb-6" />
            <div className="h-4 w-2/3 mx-auto bg-gray-100 rounded animate-pulse mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white shadow-lg rounded-lg p-4">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
