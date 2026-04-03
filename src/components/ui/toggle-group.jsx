import { createContext, useContext, useMemo, useState, forwardRef } from "react";
import { cn } from "@/lib/cn";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = createContext({
  size: "default",
  variant: "default",
  type: "single",
  value: undefined,
  setValue: () => {},
});

const ToggleGroup = forwardRef(
  (
    {
      className,
      type = "single",
      value: valueProp,
      defaultValue,
      onValueChange,
      variant,
      size,
      children,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultValue);
    const value = valueProp !== undefined ? valueProp : internal;
    const setValue = (next) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    };
    const ctx = useMemo(
      () => ({ variant, size, type, value, setValue }),
      [variant, size, type, value, setValue]
    );
    return (
      <div
        ref={ref}
        role="group"
        className={cn("flex items-center justify-center gap-1", className)}
        {...props}
      >
        <ToggleGroupContext.Provider value={ctx}>{children}</ToggleGroupContext.Provider>
      </div>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = forwardRef(({ className, children, value, variant, size, ...props }, ref) => {
  const context = useContext(ToggleGroupContext);
  const selected =
    context.type === "single"
      ? context.value === value
      : Array.isArray(context.value) && context.value.includes(value);
  return (
    <button
      ref={ref}
      type="button"
      data-state={selected ? "on" : "off"}
      aria-pressed={selected}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      onClick={() => {
        if (context.type === "single") {
          context.setValue(selected ? undefined : value);
        } else {
          const arr = Array.isArray(context.value) ? [...context.value] : [];
          const i = arr.indexOf(value);
          if (i >= 0) arr.splice(i, 1);
          else arr.push(value);
          context.setValue(arr);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
