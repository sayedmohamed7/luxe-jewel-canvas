import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSkeletonProps {
  className?: string;
}

export function ProductSkeleton({ className }: ProductSkeletonProps) {
  return (
    <div className={cn("group", className)}>
      {/* Image skeleton */}
      <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Category skeleton */}
      <Skeleton className="h-3 w-16 mb-2" />
      
      {/* Name skeleton */}
      <Skeleton className="h-5 w-3/4 mb-2" />
      
      {/* Price skeleton */}
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
