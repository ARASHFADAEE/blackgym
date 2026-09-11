import { Badge } from "@/components/ui/badge";
import { getOccupancyInfo } from "@/features/attendance/service";
import { cn } from "@/lib/utils";

type OccupancyBadgeProps = {
  current: number;
  capacity: number;
  className?: string;
};

export function OccupancyBadge({ current, capacity, className }: OccupancyBadgeProps) {
  const info = getOccupancyInfo(current, capacity);

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-border bg-secondary/40 text-foreground",
        info.level === "QUIET" && "border-emerald-500/30 text-emerald-400",
        info.level === "MODERATE" && "border-amber-500/30 text-amber-400",
        info.level === "BUSY" && "border-orange-500/30 text-orange-400",
        info.level === "VERY_BUSY" && "border-red-500/30 text-red-400",
        className,
      )}
    >
      {info.label}
      <span className="text-muted-foreground" dir="ltr">
        · {info.percent}%
      </span>
    </Badge>
  );
}
