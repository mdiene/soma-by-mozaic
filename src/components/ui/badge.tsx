import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const variantes = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', {
  variants: {
    ton: {
      neutre: 'bg-nuit-100 text-nuit-700',
      succes: 'bg-green-100 text-green-800',
      alerte: 'bg-amber-100 text-amber-900',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    },
  },
  defaultVariants: { ton: 'neutre' },
})

export type Ton = NonNullable<VariantProps<typeof variantes>['ton']>

export function Badge({ className, ton, ...props }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof variantes>) {
  return <span className={cn(variantes({ ton }), className)} {...props} />
}
