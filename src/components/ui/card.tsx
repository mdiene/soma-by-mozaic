import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-bordure bg-surface', className)} {...props} />
}

export function CardHeader({ titre, description, actions }: { titre: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-bordure px-5 py-4">
      <div>
        <h2 className="text-base font-semibold text-texte">{titre}</h2>
        {description && <p className="mt-0.5 text-sm text-texte-doux">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}
