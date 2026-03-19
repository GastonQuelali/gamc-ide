import { Card, CardContent } from "@/components/ui/card"

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
