import { Children, cloneElement, forwardRef, isValidElement } from "react";
import { cn } from "@/lib/cn";

function mergeRefs(...refs) {
  return (node) => {
    for (const ref of refs) {
      if (ref == null) continue;
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };
}

/** Merges props onto a single child (Radix Slot–compatible). */
export const Slot = forwardRef(({ children, ...slotProps }, ref) => {
  const child = Children.only(children);
  if (!isValidElement(child)) return null;
  return cloneElement(child, {
    ...mergeSlotProps(slotProps, child.props),
    ref: mergeRefs(ref, child.ref),
  });
});
Slot.displayName = "Slot";

function mergeSlotProps(slotProps, childProps) {
  const merged = { ...childProps, ...slotProps };
  if (slotProps.className || childProps.className) {
    merged.className = cn(childProps.className, slotProps.className);
  }
  if (slotProps.style && childProps.style) {
    merged.style = { ...childProps.style, ...slotProps.style };
  }
  const onSlotClick = slotProps.onClick;
  const onChildClick = childProps.onClick;
  if (onSlotClick || onChildClick) {
    merged.onClick = (e) => {
      onChildClick?.(e);
      onSlotClick?.(e);
    };
  }
  return merged;
}
