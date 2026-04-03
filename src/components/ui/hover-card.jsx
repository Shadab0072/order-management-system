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
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const HoverCtx = createContext(null);

function HoverCard({ openDelay = 700, closeDelay = 300, children }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const value = useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
      openDelay,
      closeDelay,
      openTimer,
      closeTimer,
    }),
    [open, openDelay, closeDelay]
  );
  return <HoverCtx.Provider value={value}>{children}</HoverCtx.Provider>;
}

const HoverCardTrigger = forwardRef(({ asChild, children, ...props }, ref) => {
  const ctx = useContext(HoverCtx);
  if (!ctx) throw new Error("HoverCardTrigger must be inside HoverCard");
  const setRefs = (node) => {
    ctx.triggerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  const show = () => {
    clearTimeout(ctx.closeTimer.current);
    ctx.openTimer.current = setTimeout(() => ctx.setOpen(true), ctx.openDelay);
  };
  const hide = () => {
    clearTimeout(ctx.openTimer.current);
    ctx.closeTimer.current = setTimeout(() => ctx.setOpen(false), ctx.closeDelay);
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
    });
  }
  return (
    <span ref={setRefs} onMouseEnter={show} onMouseLeave={hide} {...props}>
      {children}
    </span>
  );
});
HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = forwardRef(({ className, sideOffset = 4, children, ...props }, ref) => {
  const ctx = useContext(HoverCtx);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!ctx?.open || !ctx.triggerRef.current) return;
    const rect = ctx.triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + (sideOffset || 0),
      left: rect.left + rect.width / 2,
    });
  }, [ctx?.open, sideOffset, ctx?.triggerRef]);

  if (!ctx || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            transform: "translateX(-50%)",
            zIndex: 50,
          }}
          className={cn(
            "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
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
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardContent, HoverCardTrigger };
