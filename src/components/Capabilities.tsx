import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { capabilities } from '../data/content'
import Reveal from './Reveal'
import SmartImage from './SmartImage'

export default function Capabilities() {
  const [active, setActive] = useState<string | null>(null)

  // Tapping anywhere outside a card puts it back down.
  useEffect(() => {
    const away = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-cap-card]')) setActive(null)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [])

  return (
    <section id="platform" className="bg-ivory px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Platform capabilities</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-forest sm:text-4xl">Everything your organisation runs on, in one place.</h2>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ image, alt, title, text }, i) => {
            const on = active === title
            return (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <motion.div
                  data-cap-card
                  tabIndex={0}
                  animate={{ y: on ? -8 : 0 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                  onPointerEnter={e => e.pointerType === 'mouse' && setActive(title)}
                  onPointerLeave={e => e.pointerType === 'mouse' && setActive(a => (a === title ? null : a))}
                  onPointerDown={e => e.pointerType !== 'mouse' && setActive(title)}
                  onFocus={() => setActive(title)}
                  onBlur={() => setActive(a => (a === title ? null : a))}
                  className={`h-full touch-manipulation overflow-hidden rounded-2xl border bg-white outline-none transition-shadow duration-300 ${on ? 'border-forest/30 shadow-lift' : 'border-sage shadow-card'}`}
                >
                  <div className="overflow-hidden">
                    <SmartImage
                      src={image} alt={alt}
                      className={`h-44 w-full transition-transform duration-500 ${on ? 'scale-110' : 'scale-100'}`}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-forest">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{text}</p>
                    <span className={`mt-5 block h-0.5 bg-gold transition-all duration-300 ${on ? 'w-14' : 'w-8'}`} />
                  </div>
                </motion.div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}