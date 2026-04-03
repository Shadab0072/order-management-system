import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const Progress = forwardRef(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={value ?? undefined}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <motion.div
      className="h-full bg-primary"
      initial={false}
      animate={{ width: `${Math.min(100, Math.max(0, value ?? 0))}%` }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
