import { Card, CardContent } from "@/components/ui/card"

interface SkeletonTableProps {
  rows?: number
  className?: string
}

export function SkeletonTable({ rows = 5, className = "" }: SkeletonTableProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-2">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
