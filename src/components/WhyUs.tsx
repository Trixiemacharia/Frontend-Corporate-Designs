import { advantages } from '../data/content'
import { images } from '../data/brand'
import Reveal from './Reveal'
import SmartImage from './SmartImage'

export default function WhyUs() {
  return (
    <section id="solutions" className="bg-sage/50 px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
        <Reveal className="relative lg:col-span-7">
          <SmartImage src={images.whyUs} alt="A bright, modern workplace" className="aspect-[4/3] w-full rounded-2xl shadow-lift lg:aspect-[5/4]" />
          <div className="absolute -bottom-6 right-4 max-w-[15rem] rounded-xl bg-forest p-5 text-white shadow-lift lg:-right-8">
            <p className="text-3xl font-extrabold text-gold">35%</p>
            <p className="mt-1 text-sm text-white/80">average efficiency gain (illustrative)</p>
          </div>
        </Reveal>
        <div className="lg:col-span-5 lg:pl-6">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Why choose us</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-forest sm:text-4xl">Built for organisations that value clarity.</h2>
          </Reveal>
          <ul className="mt-8 space-y-7">
            {advantages.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-forest shadow-card"><Icon size={20} /></span>
                  <div><h3 className="font-bold text-forest">{title}</h3><p className="mt-1 text-sm leading-relaxed text-charcoal/70">{text}</p></div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}