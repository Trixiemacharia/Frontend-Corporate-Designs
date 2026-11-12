import { useState, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'

const base = 'min-h-12 w-full rounded-lg border bg-ivory/60 text-charcoal transition-colors placeholder:text-charcoal/35 focus:border-forest focus:bg-white'
type Common = { id: string; label: string; error?: string; hint?: string; icon?: LucideIcon }

const Lead = ({ icon: Icon }: { icon?: LucideIcon }) =>
  Icon ? <Icon size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/45" /> : null

const Msg = ({ id, error, hint }: { id: string; error?: string; hint?: string }) =>
  error ? <p id={`${id}-e`} className="mt-1.5 text-sm text-red-600">{error}</p>
    : hint ? <p id={`${id}-h`} className="mt-1.5 text-xs text-charcoal/55">{hint}</p> : null

export function Field({ id, label, error, hint, icon, type, ...p }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false)
  const pw = type === 'password'
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest">{label}</label>
      <div className="relative">
        <Lead icon={icon} />
        <input id={id} type={pw && show ? 'text' : type} aria-invalid={!!error}
          aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined} {...p}
          className={`${base} ${icon ? 'pl-10' : 'pl-4'} ${pw ? 'pr-12' : 'pr-4'} ${error ? 'border-red-500' : 'border-sage'}`} />
        {pw && (
          <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-charcoal/50 hover:text-forest">
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      <Msg id={id} error={error} hint={hint} />
    </div>
  )
}

export function SelectField({ id, label, error, icon, options, ...p }: Common & { options: string[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest">{label}</label>
      <div className="relative">
        <Lead icon={icon} />
        <select id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...p}
          className={`${base} ${icon ? 'pl-10' : 'pl-4'} pr-4 ${error ? 'border-red-500' : 'border-sage'}`}>
          <option value="">Select…</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <Msg id={id} error={error} />
    </div>
  )
}