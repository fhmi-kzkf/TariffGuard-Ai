import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "compliant" | "non-compliant" | "review" | "low" | "medium" | "high" | "critical" | "default" | "worker" | "manager"
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  let variantStyles = ""
  
  switch(variant) {
    case "compliant":
      variantStyles = "bg-[rgba(17,255,153,0.1)] text-accent-green border border-[rgba(17,255,153,0.2)]"
      break;
    case "non-compliant":
    case "high":
    case "critical":
      variantStyles = "bg-[rgba(255,32,71,0.1)] text-accent-red border border-[rgba(255,32,71,0.2)]"
      if (variant === "critical") variantStyles += " animate-pulse"
      break;
    case "review":
    case "medium":
      variantStyles = "bg-[rgba(255,197,61,0.1)] text-accent-yellow border border-[rgba(255,197,61,0.2)]"
      break;
    case "low":
      variantStyles = "bg-[rgba(17,255,153,0.1)] text-accent-green border border-[rgba(17,255,153,0.2)]"
      break;
    case "worker":
      variantStyles = "bg-[rgba(0,117,255,0.1)] text-accent-blue border border-[rgba(0,117,255,0.2)]"
      break;
    case "manager":
      variantStyles = "bg-[rgba(255,89,0,0.1)] text-[#ff5900] border border-[rgba(255,89,0,0.2)]"
      break;
    case "default":
    default:
      variantStyles = "bg-surface-elevated border border-hairline-strong text-charcoal"
      break;
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyles} ${className}`}
      {...props}
    />
  )
}
