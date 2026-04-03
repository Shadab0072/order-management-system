import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const baseToggleClasses =
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground";

const toggleVariantClasses = {
  default: "bg-transparent",
  outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
};

const toggleSizeClasses = {
  default: "h-10 px-3",
  sm: "h-9 px-2.5",
  lg: "h-11 px-5",
};

const getToggleClasses = ({ variant, size, className }) =>
  cn(
    baseToggleClasses,
    toggleVariantClasses[variant] ?? toggleVariantClasses.default,
    toggleSizeClasses[size] ?? toggleSizeClasses.default,
    className
  );

const Toggle = forwardRef(
  (
    { className, variant = "default", size = "default", pressed: pressedProp, defaultPressed, onPressedChange, ...props },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultPressed ?? false);
    const isOn = pressedProp !== undefined ? pressedProp : internal;
    const toggle = () => {
      const next = !isOn;
      if (pressedProp === undefined) setInternal(next);
      onPressedChange?.(next);
    };
    return (
      <motion.button
        ref={ref}
        type="button"
        aria-pressed={isOn}
        data-state={isOn ? "on" : "off"}
        whileTap={{ scale: 0.97 }}
        className={getToggleClasses({ variant, size, className })}
        onClick={toggle}
        {...props}
      />
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle, getToggleClasses as toggleVariants };
