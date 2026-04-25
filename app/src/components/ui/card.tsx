import * as React from 'react'
import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col rounded-[12px] border border-border/60 [box-shadow:var(--shadow-card)]',
        className,
      )}
      {...props}
    />
  )
}

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="card-content" className={cn('p-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export { Card, CardContent }
