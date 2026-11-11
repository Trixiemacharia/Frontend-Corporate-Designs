import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

const base = 'min-h-12 w-full rounded-lg border bg-white px-4 text-charcoal transition-colors placeholder:text-charcoal/35 focus:border-forest'
type Common = { id: string; label: string; error?: string; hint?: string }

export function Field({ id, label, error, hint, ...p }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest">{label}</label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined} {...p}
        className={`${base} ${error ? 'border-red-500' : 'border-sage'}`} />
      {error ? <p id={`${id}-e`} className="mt-1.5 text-sm text-red-600">{error}</p>
        : hint && <p id={`${id}-h`} className="mt-1.5 text-xs text-charcoal/55">{hint}</p>}
    </div>
  )
}

export function SelectField({ id, label, error, options, ...p }: Common & { options: string[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest">{label}</label>
      <select id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...p}
        className={`${base} ${error ? 'border-red-500' : 'border-sage'}`}>
        <option value="">Select…</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      {error && <p id={`${id}-e`} className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}