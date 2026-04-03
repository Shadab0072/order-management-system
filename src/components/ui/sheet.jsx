import { forwardRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  Dialog as Sheet,
  DialogClose as SheetClose,
  DialogPortal as SheetPortal,
  DialogTrigger as SheetTrigger,
  useDialogContext,
} from "@/components/ui/dialog";

const SheetOverlay = forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

const getSheetClasses = (side) =>
  cn(
    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
    side === "top" && "inset-x-0 top-0 border-b",
    side === "bottom" && "inset-x-0 bottom-0 border-t",
    side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    (!side || side === "right") && "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
  );

const SheetContent = forwardRef(({ side = "right", className, children, ...props }, ref) => {
  const { open, setOpen } = useDialogContext();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const slideVariants = {
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  };

  const slide = slideVariants[side] ?? slideVariants.right;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <SheetOverlay onClick={() => setOpen(false)} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            initial={slide.initial}
            animate={slide.animate}
            exit={slide.exit}
            transition={{ type: "tween", duration: 0.3 }}
            className={cn(getSheetClasses(side), className)}
            {...props}
          >
            {children}
            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
