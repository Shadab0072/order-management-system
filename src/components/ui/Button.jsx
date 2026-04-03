import { cloneElement, forwardRef, isValidElement } from "react";
import { cn } from "@/lib/cn";

const baseButtonClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const buttonVariantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const buttonSizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

const getButtonClasses = ({ variant, size, className }) =>
  cn(
    baseButtonClasses,
    buttonVariantClasses[variant] ?? buttonVariantClasses.default,
    buttonSizeClasses[size] ?? buttonSizeClasses.default,
    className
  );

const Button = forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const { children, ...rest } = props;
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...rest,
      ref,
      className: cn(getButtonClasses({ variant, size, className }), children.props.className),
    });
  }
  return (
    <button
      type="button"
      className={getButtonClasses({ variant, size, className })}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, getButtonClasses as buttonVariants };
