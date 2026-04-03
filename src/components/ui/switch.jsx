import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const Switch = forwardRef(({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isOn = checked !== undefined ? checked : internal;
  const toggle = () => {
    const next = !isOn;
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  };
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isOn}
      data-state={isOn ? "checked" : "unchecked"}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        isOn ? "bg-primary" : "bg-input",
        className
      )}
      onClick={toggle}
      {...props}
    >
      <motion.span
        className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0"
        animate={{ x: isOn ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
});
Switch.displayName = "Switch";

export { Switch };
