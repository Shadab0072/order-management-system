import { createContext, useContext, useMemo, useState, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

const NavCtx = createContext(null);

const NavigationMenu = forwardRef(({ className, children, ...props }, ref) => {
  const [active, setActive] = useState(null);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return (
    <nav
      ref={ref}
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      <NavCtx.Provider value={value}>{children}</NavCtx.Provider>
    </nav>
  );
});
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = ({ className, ...props }) => (
  <li className={cn(className)} {...props} />
);

const navigationMenuTriggerStyle = () =>
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";

const NavigationMenuTrigger = forwardRef(({ className, children, value, ...props }, ref) => {
  const ctx = useContext(NavCtx);
  const id = value ?? "default";
  const open = ctx?.active === id;
  return (
    <button
      ref={ref}
      type="button"
      data-state={open ? "open" : "closed"}
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      onClick={() => ctx?.setActive(open ? null : id)}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "relative top-[1px] ml-1 h-3 w-3 transition duration-200",
          open && "rotate-180"
        )}
        aria-hidden="true"
      />
    </button>
  );
});
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = forwardRef(({ className, children, ...props }, ref) => {
  const ctx = useContext(NavCtx);
  const show = ctx?.active != null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "left-0 top-auto w-full md:absolute md:left-0 md:top-full md:mt-1.5 md:w-auto rounded-md border bg-popover text-popover-foreground shadow-lg",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuLink = forwardRef(({ className, href, ...props }, ref) => (
  <a ref={ref} href={href} className={cn(className)} {...props} />
));
NavigationMenuLink.displayName = "NavigationMenuLink";

const NavigationMenuViewport = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("absolute left-0 top-full flex w-full justify-center", className)} {...props} />
));
NavigationMenuViewport.displayName = "NavigationMenuViewport";

const NavigationMenuIndicator = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:opacity-100 data-[state=hidden]:opacity-0",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </div>
));
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
