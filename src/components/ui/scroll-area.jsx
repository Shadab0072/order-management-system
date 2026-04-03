import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const ScrollArea = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <div className="h-full w-full overflow-auto rounded-[inherit]">{children}</div>
  </div>
));
ScrollArea.displayName = "ScrollArea";

const ScrollBar = forwardRef(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  />
));
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
