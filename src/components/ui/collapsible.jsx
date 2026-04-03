import {
  createContext,
  useContext,
  useMemo,
  useState,
  forwardRef,
  cloneElement,
  isValidElement,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

const CollapsibleCtx = createContext(null);

function Collapsible({ open: openProp, defaultOpen, onOpenChange, children, className, ...props }) {
  const [internal, setInternal] = useState(defaultOpen ?? false);
  const open = openProp !== undefined ? openProp : internal;
  const setOpen = (v) => {
    const next = typeof v === "function" ? v(open) : v;
    if (openProp === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  const ctx = useMemo(() => ({ open, setOpen }), [open, setOpen]);
  return (
    <CollapsibleCtx.Provider value={ctx}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </CollapsibleCtx.Provider>
  );
}

const CollapsibleTrigger = forwardRef(({ asChild, children, ...props }, ref) => {
  const ctx = useContext(CollapsibleCtx);
  if (!ctx) throw new Error("CollapsibleTrigger must be inside Collapsible");
  const toggle = () => ctx.setOpen(!ctx.open);
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ref,
      onClick: (e) => {
        children.props.onClick?.(e);
        toggle();
      },
    });
  }
  return (
    <button ref={ref} type="button" onClick={toggle} {...props}>
      {children}
    </button>
  );
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = forwardRef(({ className, children, ...props }, ref) => {
  const ctx = useContext(CollapsibleCtx);
  if (!ctx) throw new Error("CollapsibleContent must be inside Collapsible");
  return (
    <AnimatePresence initial={false}>
      {ctx.open && (
        <motion.div
          ref={ref}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("overflow-hidden", className)}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
