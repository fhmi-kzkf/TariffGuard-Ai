import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "ghost" | "outline"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    let variantStyles = ""
    if (variant === "primary") {
      variantStyles = "bg-ink text-canvas hover:bg-opacity-90"
    } else if (variant === "ghost") {
      variantStyles = "bg-surface-elevated text-ink border border-hairline-strong hover:bg-surface-card"
    } else if (variant === "outline") {
      variantStyles = "bg-canvas text-ink border border-hairline-strong hover:bg-surface-card"
    }

    return (
      <Comp
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-[14px] font-medium h-[36px] px-[16px] py-[8px] transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variantStyles} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
