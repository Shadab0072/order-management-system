import { createContext, useContext, useMemo, useState, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

const AccordionCtx = createContext(null);
const AccordionItemContext = createContext(null);

function Accordion({ type = "single", collapsible = false, children, className, ...props }) {
  const [open, setOpen] = useState(type === "multiple" ? [] : null);
  const ctx = useMemo(
    () => ({
      type,
      collapsible,
      open,
      setOpen,
    }),
    [type, collapsible, open]
  );
  return (
    <AccordionCtx.Provider value={ctx}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </AccordionCtx.Provider>
  );
}

const AccordionItem = forwardRef(({ className, value, children, ...props }, ref) => {
  const ctx = useContext(AccordionCtx);
  if (!ctx) throw new Error("AccordionItem must be inside Accordion");
  const isOpen =
    ctx.type === "single"
      ? ctx.open === value
      : Array.isArray(ctx.open) && ctx.open.includes(value);
  const toggle = () => {
    if (ctx.type === "single") {
      if (ctx.open === value && ctx.collapsible) ctx.setOpen(null);
      else ctx.setOpen(value);
    } else {
      const arr = Array.isArray(ctx.open) ? [...ctx.open] : [];
      const i = arr.indexOf(value);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(value);
      ctx.setOpen(arr);
    }
  };
  const itemCtx = { value, isOpen, toggle };
  return (
    <div ref={ref} data-state={isOpen ? "open" : "closed"} className={cn("border-b", className)} {...props}>
      <AccordionItemContext.Provider value={itemCtx}>{children}</AccordionItemContext.Provider>
    </div>
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = forwardRef(({ className, children, ...props }, ref) => {
  const item = useContext(AccordionItemContext);
  if (!item) throw new Error("AccordionTrigger must be inside AccordionItem");
  return (
    <h3 className="flex">
      <button
        ref={ref}
        type="button"
        aria-expanded={item.isOpen}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        data-state={item.isOpen ? "open" : "closed"}
        onClick={item.toggle}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform duration-200", item.isOpen && "rotate-180")}
        />
      </button>
    </h3>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef(({ className, children, ...props }, ref) => {
  const item = useContext(AccordionItemContext);
  if (!item) throw new Error("AccordionContent must be inside AccordionItem");
  return (
    <AnimatePresence initial={false}>
      {item.isOpen && (
        <motion.div
          ref={ref}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden text-sm"
          {...props}
        >
          <div className={cn("pb-4 pt-0", className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
