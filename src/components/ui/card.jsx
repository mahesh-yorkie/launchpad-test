import { cn } from '../../lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-[var(--shadow-card)]',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <h1
      className={cn(
        'text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-[15px] leading-6 text-muted-foreground', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return <div className={cn('pt-0', className)} {...props} />
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle }
