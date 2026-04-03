import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import {
  Sheet as Drawer,
  SheetClose as DrawerClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger as DrawerTrigger,
} from "@/components/ui/sheet";

const DrawerContent = forwardRef(({ className, children, ...props }, ref) => (
  <SheetContent ref={ref} side="bottom" className={cn("mt-24 max-h-[96vh]", className)} {...props}>
    <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
    {children}
  </SheetContent>
));
DrawerContent.displayName = "DrawerContent";

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
