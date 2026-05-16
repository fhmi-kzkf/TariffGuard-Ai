import * as React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 0 | 1 | 2 | 3
}

export function Card({ className = "", level = 1, ...props }: CardProps) {
  let bgClass = "bg-canvas"
  let borderClass = ""
  
  if (level === 1) {
    bgClass = "bg-surface-card"
    borderClass = "border border-hairline-strong"
  } else if (level === 2) {
    bgClass = "bg-surface-elevated"
    borderClass = "border border-hairline-strong"
  } else if (level === 3) {
    bgClass = "bg-surface-deep"
    borderClass = "border border-hairline-strong"
  }

  return (
    <div
      className={`rounded-[12px] ${bgClass} ${borderClass} ${className}`}
      {...props}
    />
  )
}
