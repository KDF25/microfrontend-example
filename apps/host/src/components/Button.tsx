import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  style?: CSSProperties;
}

export function Button({
  variant = "secondary",
  size = "md",
  children,
  className,
  ...rest
}: Props) {
  const cls = ["btn", `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(" ");
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
