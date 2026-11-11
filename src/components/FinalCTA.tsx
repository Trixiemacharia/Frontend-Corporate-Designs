import Button from './Button'
import Reveal from './Reveal'
import { useCurtain } from './CurtainProvider'

export default function FinalCTA() {
  const { go } = useCurtain()
  return (
    <section className="relative overflow-hidden bg-forest px-5 py-24 text-center sm:px-8">
      <div aria-hidden="true" className="absolute -left-16 top-8 h-48 w-48 rotate-12 rounded-3xl border border-gold/30" />
      <div aria-hidden="true" className="absolute -bottom-12 right-10 h-40 w-40 rounded-full border border-white/10" />
      <Reveal className="relative mx-auto max-w-2xl">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Build a More Connected Organisation.</h2>
        <p className="mt-4 text-white/70">Set up your workspace in a few minutes.</p>
        <Button variant="light" className="mt-8" onClick={() => go('/onboarding')}>Get Started</Button>
      </Reveal>
    </section>
  )
}