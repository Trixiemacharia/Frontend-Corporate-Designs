import type { ReactNode } from 'react'
import { ArrowRight, Check, ShieldCheck, TrendingUp, Zap } from 'lucide-react'
import { images } from '../data/brand'
import Logo from './Logo'
import SmartImage from './SmartImage'

export const stepLabels = ['Account', 'Organisation', 'Role', 'Preferences', 'Done']
const perks = [{ icon: Zap, label: 'Work Smarter' }, { icon: ShieldCheck, label: 'Stay Secure' }, { icon: TrendingUp, label: 'Grow Faster' }]

function Stepper({ current, done }: { current: number; done: boolean }) {
  const pct = done ? 100 : (current / (stepLabels.length - 1)) * 100
  return (
    <nav aria-label="Progress">
      <ol className="relative grid grid-cols-5">
        <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-3.5 h-px bg-sage">
          <span className="block h-full bg-forest transition-all duration-500" style={{ width: `${pct}%` }} />
        </span>
        {stepLabels.map((label, i) => {
          const complete = done || i < current
          const active = !done && i === current
          return (
            <li key={label} aria-current={active ? 'step' : undefined} className="relative flex flex-col items-center gap-1.5">
              <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-bold transition-colors ${complete || active ? 'border-forest bg-forest text-white' : 'border-sage bg-white text-charcoal/50'}`}>
                {complete ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>
              <span className={`text-[10px] font-medium sm:text-xs ${active ? 'text-forest' : 'text-charcoal/55'}`}>{label}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

type Props = { current: number; done: boolean; onSignIn: () => void; children: ReactNode }

export default function OnboardingShell({ current, done, onSignIn, children }: Props) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-forest text-white">
      <SmartImage priority src={images.hero} alt="" className="absolute inset-0 -z-20 h-full w-full" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a2820]/95 via-forest/85 to-forest/60" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Logo light />
          <p className="text-sm text-white/75">
            <span className="hidden sm:inline">Already have an account? </span>
            <button onClick={onSignIn} className="inline-flex items-center gap-1 font-semibold text-white hover:text-mint">Sign In <ArrowRight size={14} /></button>
          </p>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_520px] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-mint" />Get Started
            </span>
            <p className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              Let’s build<br />your <span className="text-mint">workspace.</span>
            </p>
            <p className="mt-5 max-w-sm text-lg text-white/80">Join Meridian and experience a smarter, more connected way to work.</p>

            <ul className="mt-10 hidden gap-8 lg:flex">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex flex-col items-center gap-2 text-center text-sm font-medium text-white/85">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5"><Icon size={19} /></span>{label}
                </li>
              ))}
            </ul>

            <div className="mt-10 hidden items-center gap-3 border-t border-white/15 pt-6 lg:flex">
              <div className="flex -space-x-2" aria-hidden="true">
                {['AO', 'JK', 'MN'].map((x, i) => (
                  <span key={x} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-forest text-[10px] font-bold ${['bg-sage text-forest', 'bg-gold text-white', 'bg-mint text-forest'][i]}`}>{x}</span>
                ))}
              </div>
              <p className="text-sm text-white/75">Trusted by 10,000+ organisations worldwide <span className="text-white/45">(illustrative)</span></p>
            </div>
          </div>

          <div className="w-full max-w-[520px] justify-self-center lg:justify-self-end">
            <div className="rounded-2xl bg-white p-6 text-charcoal shadow-lift sm:p-8">
              <Stepper current={current} done={done} />
              <div className="mt-7">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}