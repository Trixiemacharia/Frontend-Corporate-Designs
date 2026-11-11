import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data/content'
import Button from './Button'
import Logo from './Logo'
import { useCurtain } from './CurtainProvider'

export default function Navbar({ onSignIn }: { onSignIn: () => void }) {
  const { go } = useCurtain()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 24)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  const bg = solid || open ? 'border-sage bg-ivory/95 shadow-sm backdrop-blur' : 'border-transparent bg-transparent'

  return (
    <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${bg}`}>
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map(l => (
            <li key={l.href}><a href={l.href} className="text-sm font-medium text-charcoal/75 transition-colors hover:text-forest">{l.label}</a></li>
          ))}
        </ul>
        <div className="hidden items-center gap-5 lg:flex">
          <button onClick={onSignIn} className="text-sm font-medium text-charcoal/75 hover:text-forest">Sign in</button>
          <Button onClick={() => go('/onboarding')} className="min-h-10 px-5">Get Started</Button>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-md text-forest lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open} aria-controls="m-menu" onClick={() => setOpen(o => !o)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="m-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden">
            <ul className="space-y-1 px-5 pb-2">
              {navLinks.map(l => (
                <li key={l.href}><a href={l.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 font-medium text-charcoal/80 hover:bg-sage/60">{l.label}</a></li>
              ))}
            </ul>
            <div className="flex gap-3 px-5 pb-5">
              <Button variant="outline" className="flex-1" onClick={() => { setOpen(false); onSignIn() }}>Sign in</Button>
              <Button className="flex-1" onClick={() => { setOpen(false); go('/onboarding') }}>Get Started</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}