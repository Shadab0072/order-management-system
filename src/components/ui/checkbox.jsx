import { forwardRef, useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

const Checkbox = forwardRef(
  ({ className, checked: checkedProp, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [internal, setInternal] = useState(defaultChecked ?? false);
    const checked = checkedProp !== undefined ? checkedProp : internal;
    const toggle = () => {
      const next = !checked;
      if (checkedProp === undefined) setInternal(next);
      onCheckedChange?.(next);
    };
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked && "bg-primary text-primary-foreground",
          className
        )}
        onClick={toggle}
        {...props}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              className="flex items-center justify-center text-current"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Check className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
