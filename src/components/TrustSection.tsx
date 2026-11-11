import { metrics, partners } from '../data/content'
import Reveal from './Reveal'

export default function TrustSection() {
  return (
    <section id="about" className="border-y border-sage bg-white px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="mx-auto max-w-2xl text-xl font-semibold leading-snug text-forest">
            Trusted by organisations that cannot afford downtime, guesswork or gaps in control.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map(p => (
              <li key={p} className="grid h-14 place-items-center rounded-lg border border-sage bg-ivory text-sm font-bold tracking-wide text-charcoal/40">{p}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            {metrics.map(m => (
              <div key={m.label} className="border-l-2 border-gold pl-5">
                <dt className="order-2 text-sm text-charcoal/65">{m.label}</dt>
                <dd className="text-4xl font-extrabold text-forest">{m.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-xs text-charcoal/45">Partner logos and figures are illustrative placeholders.</p>
        </Reveal>
      </div>
    </section>
  )
}