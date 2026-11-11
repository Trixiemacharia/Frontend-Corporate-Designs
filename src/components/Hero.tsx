import { motion, type Variants } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { images } from '../data/brand'
import Button from './Button'
import SmartImage from './SmartImage'
import { useCurtain } from './CurtainProvider'

const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }
const item: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }

export default function Hero() {
  const { go } = useCurtain()
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        <motion.div variants={group} initial="hidden" animate="show">
          <motion.p variants={item} className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Enterprise platform</motion.p>
          <motion.h1 variants={item} className="mt-5 text-5xl font-extrabold leading-[1.04] tracking-tight text-forest sm:text-6xl xl:text-7xl">
            Intelligent Systems.<br />Better Business.
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/75">
            One platform to streamline operations, manage teams and sharpen decision-making, so your organisation runs with clarity at every level.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => go('/onboarding')}>Get Started <ArrowRight size={16} /></Button>
            <Button variant="outline" href="#platform">Explore Platform</Button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.25 }}
          className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div aria-hidden="true" className="absolute -right-4 -top-5 h-28 w-28 rounded-2xl border border-gold/60 sm:-right-6" />
          <div aria-hidden="true" className="absolute -bottom-5 right-14 -z-10 h-20 w-20 rounded-full bg-sage" />
          <div className="overflow-hidden rounded-2xl shadow-lift">
            <SmartImage priority src={images.hero} alt="A modern corporate headquarters" className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5]" />
          </div>

          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 left-2 w-52 rounded-xl bg-white p-4 shadow-card sm:-left-8">
            <p className="text-xs font-medium text-charcoal/60">Operational efficiency</p>
            <p className="mt-1 text-2xl font-extrabold text-forest">+24%</p>
            <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden="true">
              {[40, 55, 48, 70, 62, 88].map((h, i) => <span key={i} className="flex-1 rounded-sm bg-forest/80" style={{ height: `${h}%` }} />)}
            </div>
            <p className="mt-2 text-[10px] text-charcoal/45">Sample data</p>
          </motion.div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-2 top-10 rounded-xl bg-white p-4 shadow-card sm:-right-6">
            <p className="text-xs font-medium text-charcoal/60">Team activity</p>
            <div className="mt-2 flex items-center -space-x-2" aria-hidden="true">
              {['AO', 'JK', 'MN'].map((x, i) => (
                <span key={x} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white text-[10px] font-bold ${['bg-sage text-forest', 'bg-forest text-white', 'bg-gold text-white'][i]}`}>{x}</span>
              ))}
            </div>
            <p className="mt-2 text-sm font-bold text-forest">128 active today</p>
          </motion.div>

          <div className="absolute -bottom-4 right-4 flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white shadow-card">
            <ShieldCheck size={14} className="text-gold" /> All systems secure
          </div>
        </motion.div>
      </div>
    </section>
  )
}