import type { HTMLAttributes } from "react";

export default function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
