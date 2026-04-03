import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

const SelectCtx = createContext(null);

const Select = ({ value: valueProp, defaultValue, onValueChange, children, ...props }) => {
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const value = valueProp !== undefined ? valueProp : internal;
  const setValue = (v) => {
    if (valueProp === undefined) setInternal(v);
    onValueChange?.(v);
    setOpen(false);
  };
  const ctx = useMemo(
    () => ({ value, setValue, open, setOpen, triggerRef }),
    [value, open]
  );
  return (
    <SelectCtx.Provider value={ctx}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectCtx.Provider>
  );
};

const SelectGroup = ({ children, ...props }) => <div {...props}>{children}</div>;

const SelectValue = ({ placeholder }) => {
  const ctx = useContext(SelectCtx);
  if (!ctx) return null;
  return <span className="line-clamp-1">{ctx.value ?? placeholder}</span>;
};

const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
  const ctx = useContext(SelectCtx);
  if (!ctx) throw new Error("SelectTrigger must be inside Select");
  const setRefs = (node) => {
    ctx.triggerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  return (
    <button
      ref={setRefs}
      type="button"
      data-select-trigger
      aria-expanded={ctx.open}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      onClick={() => ctx.setOpen(!ctx.open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
    <ChevronUp className="h-4 w-4" />
  </div>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
    <ChevronDown className="h-4 w-4" />
  </div>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = forwardRef(({ className, children, position = "popper", ...props }, ref) => {
  const ctx = useContext(SelectCtx);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    if (!ctx?.open || !ctx.triggerRef.current) return;
    const rect = ctx.triggerRef.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, [ctx?.open, ctx?.triggerRef]);

  useLayoutEffect(() => {
    if (!ctx?.open) return;
    const onDown = (e) => {
      const content = document.getElementById("select-dropdown-panel");
      const tr = ctx.triggerRef.current;
      if (content?.contains(e.target) || tr?.contains(e.target)) return;
      ctx.setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ctx?.open, ctx]);

  if (!ctx || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          id="select-dropdown-panel"
          ref={ref}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.12 }}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            minWidth: Math.max(coords.width, 128),
            zIndex: 50,
          }}
          className={cn(
            "relative z-50 max-h-96 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md",
            position === "popper" && "mt-0",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <div className={cn("p-1", position === "popper" && "max-h-72 overflow-auto")}>{children}</div>
          <SelectScrollDownButton />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});
SelectContent.displayName = "SelectContent";

const SelectLabel = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = forwardRef(({ className, children, value, ...props }, ref) => {
  const ctx = useContext(SelectCtx);
  if (!ctx) throw new Error("SelectItem must be inside Select");
  const selected = ctx.value === value;
  return (
    <button
      ref={ref}
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={() => ctx.setValue(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {selected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </button>
  );
});
SelectItem.displayName = "SelectItem";

const SelectSeparator = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
