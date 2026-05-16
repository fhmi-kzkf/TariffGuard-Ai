import * as React from "react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <select
        className={`flex h-[44px] w-full rounded-[8px] border border-hairline-strong bg-surface-card px-[14px] py-[10px] text-[14px] text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Select.displayName = "Select"

export { Select }
