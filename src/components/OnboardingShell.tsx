import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import Logo from './Logo'

export const stepLabels = ['Account', 'Organisation', 'Your role', 'Workspace', 'Confirm']

export default function OnboardingShell({ current, done, children }: { current: number; done: boolean; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[420px_1fr]">
      <aside className="relative overflow-hidden bg-forest px-5 py-5 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div aria-hidden="true" className="absolute -right-20 top-1/3 hidden h-72 w-72 rotate-12 rounded-[2rem] border border-gold/25 lg:block" />
        <div aria-hidden="true" className="absolute -bottom-16 -left-10 hidden h-56 w-56 rounded-full border border-white/10 lg:block" />
        <div className="relative flex items-center justify-between lg:block">
          <Logo light />
          <p className="text-sm text-white/70 lg:hidden">Step {done ? 5 : current + 1} of 5</p>
        </div>
        <div className="relative mt-4 h-1 rounded-full bg-white/15 lg:hidden"><div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${done ? 100 : ((current + 1) / 5) * 100}%` }} /></div>

        <div className="relative hidden lg:block">
          <h2 className="text-4xl font-extrabold leading-tight">Let's build your workspace.</h2>
          <p className="mt-4 max-w-xs text-white/70">Five short steps to set up your account, describe your organisation and tailor the platform to how you work.</p>
          <ol className="mt-10 space-y-5" aria-label="Progress">
            {stepLabels.map((s, i) => {
              const complete = done || i < current
              const active = !done && i === current
              return (
                <li key={s} aria-current={active ? 'step' : undefined} className="flex items-center gap-4">
                  <span className={`grid h-8 w-8 place-items-center rounded-full border text-sm font-bold transition-colors ${complete ? 'border-gold bg-gold text-forest' : active ? 'border-white bg-white text-forest' : 'border-white/30 text-white/50'}`}>
                    {complete ? <Check size={16} strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={active ? 'font-semibold text-white' : complete ? 'text-white/85' : 'text-white/45'}>{s}</span>
                </li>
              )
            })}
          </ol>
        </div>
        <p className="relative hidden text-xs text-white/40 lg:block">Prototype only. Nothing you enter is stored or sent.</p>
      </aside>
      <main className="flex items-center bg-ivory px-4 py-8 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-card sm:p-10">{children}</div>
      </main>
    </div>
  )
}