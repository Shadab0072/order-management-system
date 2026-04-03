import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  cloneElement,
  isValidElement
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const PopoverContext = createContext(null);

function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover components must be used within <Popover>");
  return ctx;
}

function Popover({ children }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const value = useMemo(() => ({ open, setOpen, triggerRef }), [open]);
  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

const PopoverTrigger = forwardRef(({ asChild, children, ...props }, ref) => {
  const { setOpen, open, triggerRef } = usePopoverContext();
  const toggle = () => setOpen(!open);

  const setRefs = (node) => {
    triggerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

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
    <button type="button" ref={setRefs} onClick={toggle} {...props}>
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = forwardRef(
  ({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = usePopoverContext();
    const contentRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const updatePosition = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let left = rect.left;
      if (align === "center") left = rect.left + rect.width / 2;
      if (align === "end") left = rect.right;
      const top = rect.bottom + sideOffset;
      setPosition({ top, left });
    };

    useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
    }, [open, align, sideOffset]);

    useEffect(() => {
      if (!open) return;
      const onScroll = () => updatePosition();
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
      };
    }, [open]);

    useEffect(() => {
      if (!open) return;
      const onDown = (e) => {
        const t = triggerRef.current;
        const c = contentRef.current;
        if (t?.contains(e.target) || c?.contains(e.target)) return;
        setOpen(false);
      };
      document.addEventListener("mousedown", onDown);
      return () => document.removeEventListener("mousedown", onDown);
    }, [open, setOpen]);

    if (typeof document === "undefined") return null;

    return createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            ref={(node) => {
              contentRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            role="dialog"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              transform:
                align === "center"
                  ? "translateX(-50%)"
                  : align === "end"
                    ? "translateX(-100%)"
                    : undefined,
              zIndex: 50,
            }}
            className={cn(
              "w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
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
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverContent, PopoverTrigger };
