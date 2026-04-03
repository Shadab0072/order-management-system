import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  cloneElement,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export const DialogContext = createContext(null);

export function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>");
  return ctx;
}

function Dialog({ children, open: openProp, onOpenChange, defaultOpen = false }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const setOpen = useCallback(
    (next) => {
      const value = typeof next === "function" ? next(open) : next;
      if (!isControlled) setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange, open]
  );
  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

const DialogTrigger = forwardRef(({ asChild, children, ...props }, ref) => {
  const { setOpen } = useDialogContext();
  const open = () => setOpen(true);
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ref,
      onClick: (e) => {
        children.props.onClick?.(e);
        open();
      },
    });
  }
  return (
    <button type="button" ref={ref} onClick={open} {...props}>
      {children}
    </button>
  );
});
DialogTrigger.displayName = "DialogTrigger";

const DialogPortal = ({ children }) => children;

const DialogClose = forwardRef(({ asChild, children, ...props }, ref) => {
  const { setOpen } = useDialogContext();
  const close = () => setOpen(false);
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ref,
      onClick: (e) => {
        children.props.onClick?.(e);
        close();
      },
    });
  }
  return (
    <button type="button" ref={ref} onClick={close} {...props}>
      {children}
    </button>
  );
});
DialogClose.displayName = "DialogClose";

const DialogOverlay = forwardRef(({ className, onClick, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    onClick={onClick}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = forwardRef(({ className, children, hideClose, ...props }, ref) => {
  const { open, setOpen } = useDialogContext();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DialogOverlay onClick={() => setOpen(false)} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
              className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {children}
            {!hideClose && (
              <button
                type="button"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
