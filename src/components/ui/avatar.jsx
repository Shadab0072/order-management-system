import { forwardRef, useState } from "react";
import { cn } from "@/lib/cn";

const Avatar = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = forwardRef(({ className, onError, ...props }, ref) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarFallback, AvatarImage };
