import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QueueDisplayLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-64 mx-auto mb-2" />
        <Skeleton className="h-6 w-80 mx-auto mb-2" />
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>

      {/* Service Queues Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <Skeleton className="h-6 w-32 mx-auto bg-white/20" />
            </CardHeader>
            <CardContent className="p-6">
              {/* Current Serving Skeleton */}
              <div className="text-center mb-6">
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-16 w-32 mx-auto" />
              </div>

              {/* Queue Stats Skeleton */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <Skeleton className="h-8 w-12 mx-auto mb-1" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-8 w-12 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              </div>

              {/* Progress Bar Skeleton */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>

              {/* Next in Queue Skeleton */}
              <div className="mb-4">
                <Skeleton className="h-4 w-28 mb-2" />
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>

              {/* Estimated Wait Times Skeleton */}
              <div className="text-center">
                <Skeleton className="h-4 w-32 mx-auto mb-2" />
                <Skeleton className="h-6 w-24 mx-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="text-center mt-8">
        <Skeleton className="h-4 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-80 mx-auto" />
      </div>
    </div>
  );
}


