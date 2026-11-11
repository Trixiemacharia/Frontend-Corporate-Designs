import { motion } from 'framer-motion'
import { capabilities } from '../data/content'
import Reveal from './Reveal'

export default function Capabilities() {
  return (
    <section id="platform" className="bg-ivory px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Platform capabilities</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-forest sm:text-4xl">Everything your organisation runs on, in one place.</h2>
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ icon: Icon, title, text }, i) => (
            <motion.li key={title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }} whileHover={{ y: -6 }}
              className="group rounded-2xl border border-sage bg-white p-7 shadow-card transition-shadow hover:shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-sage text-forest transition-colors group-hover:bg-forest group-hover:text-white"><Icon size={22} /></span>
              <h3 className="mt-5 text-lg font-bold text-forest">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{text}</p>
              <span className="mt-5 block h-0.5 w-8 bg-gold transition-all group-hover:w-14" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}