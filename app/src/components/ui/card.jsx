import { cn } from '@/lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-md border border-border/80 bg-card text-card-foreground shadow-card', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col', className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <h2
      className={cn('text-2xl font-bold leading-8 text-foreground tracking-[-0.4px]', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn('mt-1.5 text-base leading-6 text-muted-foreground', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return <div className={cn('p-0', className)} {...props} />
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle }
