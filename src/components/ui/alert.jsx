import * as React from "react";
import { cn } from "@/lib/cn";

const baseAlertClasses =
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";

const alertVariantClasses = {
  default: "bg-background text-foreground",
  destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
};

const getAlertClasses = ({ variant } = { variant: "default" }) =>
  cn(baseAlertClasses, alertVariantClasses[variant] ?? alertVariantClasses.default);

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => <div
  ref={ref}
  role="alert"
  className={cn(getAlertClasses({ variant }), className)}
  {...props} />);
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(
  ({ className, ...props }, ref) => <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props} />
);
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(
  ({ className, ...props }, ref) => <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props} />
);
AlertDescription.displayName = "AlertDescription";
export {
  Alert,
  AlertDescription,
  AlertTitle
};
