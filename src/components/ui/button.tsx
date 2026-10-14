import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const variantes = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variante: {
        primaire: 'bg-nuit-900 text-white hover:bg-nuit-800',
        accent: 'bg-soma-orange text-white hover:brightness-95',
        secondaire: 'border border-bordure bg-surface text-texte hover:bg-nuit-50',
        fantome: 'text-texte-doux hover:bg-nuit-50 hover:text-texte',
        danger: 'bg-danger text-white hover:brightness-95',
      },
      taille: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        icone: 'h-9 w-9',
      },
    },
    defaultVariants: { variante: 'primaire', taille: 'md' },
  },
)

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof variantes>

export function Button({ className, variante, taille, type = 'button', ...props }: Props) {
  return <button type={type} className={cn(variantes({ variante, taille }), className)} {...props} />
}
