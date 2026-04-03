import { createContext, useContext, useMemo, useState, forwardRef } from "react";
import { Circle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const RadioGroupCtx = createContext(null);

const RadioGroup = forwardRef(({ className, value: valueProp, defaultValue, onValueChange, children, ...props }, ref) => {
  const [internal, setInternal] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;
  const setValue = (v) => {
    if (valueProp === undefined) setInternal(v);
    onValueChange?.(v);
  };
  const ctx = useMemo(() => ({ value, setValue }), [value, setValue]);
  return (
    <RadioGroupCtx.Provider value={ctx}>
      <div ref={ref} role="radiogroup" className={cn("grid gap-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupCtx.Provider>
  );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = forwardRef(({ className, value, ...props }, ref) => {
  const ctx = useContext(RadioGroupCtx);
  if (!ctx) throw new Error("RadioGroupItem must be inside RadioGroup");
  const selected = ctx.value === value;
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      data-state={selected ? "checked" : "unchecked"}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => ctx.setValue(value)}
      {...props}
    >
      <motion.span
        className="flex items-center justify-center"
        initial={false}
        animate={{ scale: selected ? 1 : 0 }}
      >
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </motion.span>
    </button>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
