import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  cloneElement,
  isValidElement,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/cn";

const MenuCtx = createContext(null);

function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const value = useMemo(() => ({ open, setOpen, triggerRef }), [open]);
  return <MenuCtx.Provider value={value}>{children}</MenuCtx.Provider>;
}

const DropdownMenuTrigger = forwardRef(({ asChild, children, ...props }, ref) => {
  const ctx = useContext(MenuCtx);
  if (!ctx) throw new Error("DropdownMenuTrigger must be inside DropdownMenu");
  const setRefs = (node) => {
    ctx.triggerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  const toggle = () => ctx.setOpen(!ctx.open);
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ref: setRefs,
      onClick: (e) => {
        children.props.onClick?.(e);
        toggle();
      },
    });
  }
  return (
    <button ref={setRefs} type="button" onClick={toggle} {...props}>
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuPortal = ({ children }) => children;

const DropdownMenuContent = forwardRef(({ className, sideOffset = 4, align = "start", children, ...props }, ref) => {
  const ctx = useContext(MenuCtx);
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: undefined, right: undefined });

  const setRefs = useCallback(
    (node) => {
      panelRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  useLayoutEffect(() => {
    if (!ctx?.open || !ctx.triggerRef.current) return;
    const rect = ctx.triggerRef.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    if (align === "end") {
      setPos({ top: rect.bottom + sideOffset, left: undefined, right: vw - rect.right });
    } else {
      setPos({ top: rect.bottom + sideOffset, left: rect.left, right: undefined });
    }
  }, [ctx?.open, sideOffset, align]);

  useLayoutEffect(() => {
    if (!ctx?.open) return;
    const close = (e) => {
      if (ctx.triggerRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
      ctx.setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [ctx?.open, ctx]);

  if (!ctx || typeof document === "undefined") return null;

  const fixedStyle =
    pos.right != null
      ? { position: "fixed", top: pos.top, right: pos.right, zIndex: 50 }
      : { position: "fixed", top: pos.top, left: pos.left, zIndex: 50 };

  return createPortal(
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          ref={setRefs}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          style={fixedStyle}
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
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuGroup = ({ className, ...props }) => <div role="group" className={cn(className)} {...props} />;

const DropdownMenuItem = forwardRef(({ className, inset, onClick, ...props }, ref) => {
  const ctx = useContext(MenuCtx);
  return (
    <div
      ref={ref}
      role="menuitem"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        ctx?.setOpen(false);
      }}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = forwardRef(({ className, children, checked, ...props }, ref) => (
  <div
    ref={ref}
    role="menuitemcheckbox"
    aria-checked={checked}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioGroup = ({ className, ...props }) => (
  <div role="radiogroup" className={cn(className)} {...props} />
);

const DropdownMenuRadioItem = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="menuitemradio"
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = forwardRef(({ className, inset, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} {...props} />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} role="separator" className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({ className, ...props }) => (
  <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

const DropdownMenuSub = ({ children }) => <>{children}</>;

const DropdownMenuSubTrigger = forwardRef(({ className, inset, children, ...props }, ref) => (
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
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = forwardRef(({ className, ...props }, ref) => (
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
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
