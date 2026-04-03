import { forwardRef } from "react";

const AspectRatio = forwardRef(({ ratio = 16 / 9, children, ...props }, ref) => (
  <div ref={ref} style={{ aspectRatio: ratio }} {...props}>
    {children}
  </div>
));
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
