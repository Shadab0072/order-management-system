import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const Slider = forwardRef(({ className, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const v = value ?? defaultValue ?? min;
  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className={cn(
        "relative h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary",
        "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary",
        className
      )}
      {...props}
    />
  );
});
Slider.displayName = "Slider";

export { Slider };
