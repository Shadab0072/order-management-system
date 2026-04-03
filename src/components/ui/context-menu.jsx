import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  forwardRef,
  cloneElement,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/cn";

const Ctx = createContext(null);

function ContextMenu({ children }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const value = useMemo(() => ({ open, setOpen, pos, setPos }), [open, pos]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const ContextMenuTrigger = forwardRef(({ asChild, children, ...props }, ref) => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ContextMenuTrigger must be inside ContextMenu");
  const onContextMenu = (e) => {
    e.preventDefault();
    ctx.setPos({ x: e.clientX, y: e.clientY });
    ctx.setOpen(true);
  };
  if (asChild && isValidElement(children)) {
    return cloneElement(children, { ...props, ref, onContextMenu });
  }
  return (
    <div ref={ref} onContextMenu={onContextMenu} {...props}>
      {children}
    </div>
  );
});
ContextMenuTrigger.displayName = "ContextMenuTrigger";

const ContextMenuPortal = ({ children }) => children;

const ContextMenuContent = forwardRef(({ className, children, ...props }, ref) => {
  const ctx = useContext(Ctx);
  useLayoutEffect(() => {
    if (!ctx?.open) return;
    const close = (e) => {
      if (document.getElementById("context-menu-panel")?.contains(e.target)) return;
      ctx.setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [ctx?.open, ctx]);

  if (!ctx || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          id="context-menu-panel"
          ref={ref}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          style={{ position: "fixed", top: ctx.pos.y, left: ctx.pos.x, zIndex: 50 }}
          className={cn(
            "min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuGroup = ({ className, ...props }) => <div role="group" className={cn(className)} {...props} />;

const ContextMenuItem = forwardRef(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    role="menuitem"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuCheckboxItem = forwardRef(({ className, children, checked, ...props }, ref) => (
  <div
    ref={ref}
    role="menuitemcheckbox"
    aria-checked={checked}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Check className="h-4 w-4" />}
    </span>
    {children}
  </div>
));
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

const ContextMenuRadioGroup = ({ className, ...props }) => (
  <div role="radiogroup" className={cn(className)} {...props} />
);

const ContextMenuRadioItem = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="menuitemradio"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Circle className="h-2 w-2 fill-current" />
    </span>
    {children}
  </div>
));
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

const ContextMenuLabel = forwardRef(({ className, inset, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} {...props} />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

const ContextMenuSeparator = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} role="separator" className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

const ContextMenuShortcut = ({ className, ...props }) => (
  <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
);
ContextMenuShortcut.displayName = "ContextMenuShortcut";

const ContextMenuSub = ({ children }) => <>{children}</>;

const ContextMenuSubTrigger = forwardRef(({ className, inset, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </div>
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, x: -4 }}
    animate={{ opacity: 1, x: 0 }}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
      className
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = "ContextMenuSubContent";

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
