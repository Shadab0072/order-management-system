import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
  forwardRef,
  cloneElement,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const TooltipGroupContext = createContext({ delayDuration: 700 });

export function TooltipProvider({ children, delayDuration = 700 }) {
  const value = useMemo(() => ({ delayDuration }), [delayDuration]);
  return <TooltipGroupContext.Provider value={value}>{children}</TooltipGroupContext.Provider>;
}

const TooltipCtx = createContext(null);

function Tooltip({ children }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const value = useMemo(() => ({ open, setOpen, triggerRef }), [open]);
  return <TooltipCtx.Provider value={value}>{children}</TooltipCtx.Provider>;
}

const TooltipTrigger = forwardRef(({ asChild, children, ...props }, ref) => {
  const ctx = useContext(TooltipCtx);
  const { delayDuration } = useContext(TooltipGroupContext);
  const timerRef = useRef(null);

  if (!ctx) {
    throw new Error("TooltipTrigger must be inside <Tooltip>");
  }
  const { setOpen, triggerRef } = ctx;

  const setRefs = (node) => {
    triggerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const show = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delayDuration);
  };
  const hide = () => {
    clearTimeout(timerRef.current);
    setOpen(false);
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ref: setRefs,
      onMouseEnter: (e) => {
        children.props.onMouseEnter?.(e);
        show();
      },
      onMouseLeave: (e) => {
        children.props.onMouseLeave?.(e);
        hide();
      },
      onFocus: (e) => {
        children.props.onFocus?.(e);
        show();
      },
      onBlur: (e) => {
        children.props.onBlur?.(e);
        hide();
      },
    });
  }
  return (
    <span
      ref={setRefs}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      {...props}
    >
      {children}
    </span>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = forwardRef(({ className, sideOffset = 4, children, ...props }, ref) => {
  const ctx = useContext(TooltipCtx);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!ctx?.open || !ctx.triggerRef.current) return;
    const rect = ctx.triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.top - 8 - (sideOffset || 0),
      left: rect.left + rect.width / 2,
    });
  }, [ctx?.open, sideOffset, ctx?.triggerRef]);

  const open = ctx?.open;

  if (!ctx) return null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="tooltip"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -100%)",
            zIndex: 100,
          }}
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
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
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipTrigger };
