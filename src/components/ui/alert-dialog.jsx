import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog as AlertDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  useDialogContext,
} from "@/components/ui/dialog";

const AlertDialogContent = forwardRef((props, ref) => (
  <DialogContent ref={ref} hideClose {...props} />
));
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogAction = forwardRef(({ className, onClick, ...props }, ref) => {
  const { setOpen } = useDialogContext();
  return (
    <button
      ref={ref}
      type="button"
      className={cn(buttonVariants(), className)}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = forwardRef(({ className, onClick, ...props }, ref) => {
  const { setOpen } = useDialogContext();
  return (
    <button
      ref={ref}
      type="button"
      className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  DialogDescription as AlertDialogDescription,
  DialogFooter as AlertDialogFooter,
  DialogHeader as AlertDialogHeader,
  DialogOverlay as AlertDialogOverlay,
  DialogPortal as AlertDialogPortal,
  DialogTitle as AlertDialogTitle,
  DialogTrigger as AlertDialogTrigger,
};
