import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Button = forwardRef(
  ({ className, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex h-[var(--layout-button-h)] w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-[opacity,box-shadow] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
