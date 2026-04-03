import { createContext, useContext, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

const TabsCtx = createContext(null);

function Tabs({ defaultValue, value: valueProp, onValueChange, className, children, ...props }) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const value = valueProp !== undefined ? valueProp : internal;
  const setValue = (v) => {
    if (valueProp === undefined) setInternal(v);
    onValueChange?.(v);
  };
  const ctx = useMemo(() => ({ value, setValue }), [value, setValue]);
  return (
    <TabsCtx.Provider value={ctx}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </TabsCtx.Provider>
  );
}

const TabsList = ({ className, ...props }) => (
  <div
    role="tablist"
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
);

const TabsTrigger = ({ className, value, children, ...props }) => {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("TabsTrigger must be inside Tabs");
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      data-state={selected ? "active" : "inactive"}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        selected && "bg-background text-foreground shadow-sm",
        className
      )}
      onClick={() => ctx.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ className, value, children, ...props }) => {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("TabsContent must be inside Tabs");
  const show = ctx.value === value;
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          role="tabpanel"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
