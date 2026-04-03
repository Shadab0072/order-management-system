import { createContext, useContext, useMemo, useRef, useState, forwardRef } from "react";
import { Dot } from "lucide-react";
import { cn } from "@/lib/cn";

export const OTPInputContext = createContext(null);

const InputOTP = forwardRef(({ className, containerClassName, maxLength = 6, value: valueProp, onChange, children, ...props }, ref) => {
  const [internal, setInternal] = useState("");
  const value = valueProp !== undefined ? valueProp : internal;
  const setValue = (v) => {
    const next = v.replace(/\D/g, "").slice(0, maxLength);
    if (valueProp === undefined) setInternal(next);
    onChange?.({ target: { value: next } });
  };

  const slots = useMemo(() => {
    const chars = value.split("");
    return Array.from({ length: maxLength }, (_, i) => ({
      char: chars[i] ?? "",
      hasFakeCaret: false,
      isActive: i === value.length,
    }));
  }, [value, maxLength]);

  const ctx = useMemo(() => ({ slots, maxLength, value, setValue }), [slots, maxLength, value, setValue]);

  return (
    <OTPInputContext.Provider value={ctx}>
      <div className={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={maxLength}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn("sr-only", className)}
          {...props}
        />
        {children}
      </div>
    </OTPInputContext.Provider>
  );
});
InputOTP.displayName = "InputOTP";

const InputOTPGroup = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = useContext(OTPInputContext);
  if (!inputOTPContext) throw new Error("InputOTPSlot must be inside InputOTP");
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index] ?? {
    char: "",
    hasFakeCaret: false,
    isActive: false,
  };
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
