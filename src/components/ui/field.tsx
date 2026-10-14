import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const champ =
  'h-10 w-full rounded-lg border border-bordure bg-surface px-3 text-sm text-texte placeholder:text-texte-doux/70 focus:border-nuit-500 focus:outline-none'

export function Field({ label, erreur, children, className }: { label: string; erreur?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('flex flex-col gap-1.5 text-sm', className)}>
      <span className="font-medium text-texte">{label}</span>
      {children}
      {erreur && <span className="text-xs text-danger">{erreur}</span>}
    </label>
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(champ, className)} {...props} />
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(champ, 'pr-8', className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(champ, 'h-auto min-h-20 py-2', className)} {...props} />
}
