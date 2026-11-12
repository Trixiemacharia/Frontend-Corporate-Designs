import { Briefcase, Building2, Check, Globe, Lock, Mail, MapPin, Pencil, User, Users } from 'lucide-react'
import { Field, SelectField } from '../components/Field'
import { countries, industries, prefOptions, roles, sizes } from '../data/content'
import type { Data, Errors } from '../lib/validation'

type P = { data: Data; set: <K extends keyof Data>(k: K, v: Data[K]) => void; errors: Errors }

export const StepHeader = ({ title, text }: { title: string; text: string }) => (
  <div className="mb-6"><h1 className="text-2xl font-extrabold text-forest">{title}</h1><p className="mt-1 text-sm text-charcoal/65">{text}</p></div>
)

export function StepAccount({ data, set, errors }: P) {
  return (
    <>
      <StepHeader title="Create your account" text="Start your journey with us today." />
      <div className="space-y-4">
        <Field id="name" label="Full name" icon={User} placeholder="Enter your full name" autoComplete="name" value={data.name} onChange={e => set('name', e.target.value)} error={errors.name} />
        <Field id="email" label="Work email" icon={Mail} type="email" placeholder="you@company.com" autoComplete="email" value={data.email} onChange={e => set('email', e.target.value)} error={errors.email} />
        <Field id="password" label="Password" icon={Lock} type="password" placeholder="Create a strong password" autoComplete="new-password" hint="At least 10 characters, with a letter and a number." value={data.password} onChange={e => set('password', e.target.value)} error={errors.password} />
        <Field id="confirm" label="Confirm password" icon={Lock} type="password" placeholder="Confirm your password" autoComplete="new-password" value={data.confirm} onChange={e => set('confirm', e.target.value)} error={errors.confirm} />
      </div>
    </>
  )
}

export function StepOrg({ data, set, errors }: P) {
  return (
    <>
      <StepHeader title="Organisation details" text="Tell us about your organisation." />
      <div className="space-y-4">
        <Field id="org" label="Organisation name" icon={Building2} placeholder="Your organisation" autoComplete="organization" value={data.org} onChange={e => set('org', e.target.value)} error={errors.org} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="industry" label="Industry" icon={Briefcase} options={industries} value={data.industry} onChange={e => set('industry', e.target.value)} error={errors.industry} />
          <SelectField id="size" label="Organisation size" icon={Users} options={sizes} value={data.size} onChange={e => set('size', e.target.value)} error={errors.size} />
        </div>
        <SelectField id="country" label="Country" icon={MapPin} options={countries} value={data.country} onChange={e => set('country', e.target.value)} error={errors.country} />
        <Field id="website" label="Company website (optional)" icon={Globe} inputMode="url" placeholder="company.com" value={data.website} onChange={e => set('website', e.target.value)} error={errors.website} />
      </div>
    </>
  )
}

export function StepRole({ data, set, errors }: P) {
  return (
    <>
      <StepHeader title="Your role" text="This helps us tailor your starting view." />
      <div role="radiogroup" aria-label="Your role" className="grid gap-3 sm:grid-cols-2">
        {roles.map(({ id, label, icon: Icon }) => {
          const on = data.role === id
          return (
            <button key={id} type="button" role="radio" aria-checked={on} onClick={() => set('role', id)}
              className={`flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 text-left font-semibold transition-colors ${on ? 'border-forest bg-forest text-white' : 'border-sage text-forest hover:border-forest/50'}`}>
              <Icon size={20} className={on ? 'text-mint' : 'text-forest/70'} />{label}
            </button>
          )
        })}
      </div>
      {errors.role && <p className="mt-3 text-sm text-red-600">{errors.role}</p>}
    </>
  )
}

export function StepPrefs({ data, set, errors }: P) {
  const toggle = (id: string) => set('prefs', data.prefs.includes(id) ? data.prefs.filter(x => x !== id) : [...data.prefs, id])
  return (
    <>
      <StepHeader title="Workspace preferences" text="Choose where you would like to start. Pick one or more." />
      <div className="grid gap-3 sm:grid-cols-2">
        {prefOptions.map(({ id, label, text, icon: Icon }) => {
          const on = data.prefs.includes(id)
          return (
            <button key={id} type="button" aria-pressed={on} onClick={() => toggle(id)}
              className={`relative rounded-xl border-2 p-4 text-left transition-colors ${on ? 'border-forest bg-forest text-white' : 'border-sage hover:border-forest/50'}`}>
              <Icon size={22} className={on ? 'text-mint' : 'text-forest'} />
              <span className={`mt-3 block font-bold ${on ? '' : 'text-forest'}`}>{label}</span>
              <span className={`text-sm ${on ? 'text-white/75' : 'text-charcoal/60'}`}>{text}</span>
              {on && <Check size={16} className="absolute right-3 top-3 text-mint" />}
            </button>
          )
        })}
      </div>
      {errors.prefs && <p className="mt-3 text-sm text-red-600">{errors.prefs}</p>}
    </>
  )
}

export function StepConfirm({ data, onEdit }: { data: Data; onEdit: (step: number) => void }) {
  const groups: { step: number; title: string; rows: [string, string][] }[] = [
    { step: 0, title: 'Account', rows: [['Name', data.name], ['Email', data.email], ['Password', '••••••••••']] },
    { step: 1, title: 'Organisation', rows: [['Name', data.org], ['Industry', data.industry], ['Size', data.size], ['Country', data.country], ['Website', data.website || 'Not provided']] },
    { step: 2, title: 'Your role', rows: [['Role', data.role]] },
    { step: 3, title: 'Preferences', rows: [['Focus areas', data.prefs.join(', ')]] },
  ]
  return (
    <>
      <StepHeader title="Review and confirm" text="Check your details before creating your account." />
      <div className="space-y-3">
        {groups.map(g => (
          <section key={g.title} className="rounded-xl border border-sage p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gold">{g.title}</h2>
              <button type="button" onClick={() => onEdit(g.step)} className="flex items-center gap-1 text-sm font-semibold text-forest hover:underline"><Pencil size={14} /> Edit</button>
            </div>
            <dl className="mt-2 space-y-1 text-sm">
              {g.rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-charcoal/55">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
            </dl>
          </section>
        ))}
      </div>
    </>
  )
}