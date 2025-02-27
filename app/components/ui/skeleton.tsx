import { cn } from "@/app/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

function Skeleton({
  className,
  width,
  height,
  animated = true,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        animated && "animate-pulse",
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

export { Skeleton };
