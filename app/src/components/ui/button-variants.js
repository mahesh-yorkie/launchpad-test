import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:opacity-95 active:opacity-90',
        link: 'text-foreground underline-offset-4 hover:underline',
        ghost: 'text-foreground hover:bg-secondary/80',
      },
      size: {
        default: 'h-12 px-4 py-2.5 has-[>svg:only-child]:px-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-12 rounded-md px-8',
        inline: 'h-auto w-auto p-0 font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
