import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const baseLabelClasses =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

const Label = forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn(baseLabelClasses, className)} {...props} />
));
Label.displayName = "Label";

export { Label };
