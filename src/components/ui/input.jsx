import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-[var(--layout-input-h)] w-full min-w-0 rounded-[var(--radius-sm)] border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-[color,box-shadow] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'
