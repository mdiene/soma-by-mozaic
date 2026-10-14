import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  )
}

export function Th({ className, num, ...props }: ThHTMLAttributes<HTMLTableCellElement> & { num?: boolean }) {
  return (
    <th
      className={cn(
        'border-b border-bordure bg-nuit-50 px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-texte-doux uppercase',
        num && 'text-right',
        className,
      )}
      {...props}
    />
  )
}

export function Td({ className, num, ...props }: TdHTMLAttributes<HTMLTableCellElement> & { num?: boolean }) {
  return <td className={cn('border-b border-bordure px-4 py-2.5 align-top', num && 'text-right whitespace-nowrap', className)} {...props} />
}
