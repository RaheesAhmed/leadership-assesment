import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Spinner({ className, size = 16, ...props }: SpinnerProps) {
  return (
    <Loader2 className={cn("animate-spin", className)} size={size} {...props} />
  );
}
