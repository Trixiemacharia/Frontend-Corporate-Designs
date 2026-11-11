import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LockKeyhole, X } from 'lucide-react'
import Button from './Button'

export default function DemoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/60 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="dlg" onClick={e => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-lift"
            initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }}>
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-charcoal/50 hover:text-charcoal"><X size={20} /></button>
            <LockKeyhole className="text-gold" size={26} />
            <h2 id="dlg" className="mt-4 text-xl font-extrabold text-forest">Sign in</h2>
            <p className="mt-2 text-sm text-charcoal/70">This is a frontend-only prototype, so there is no real sign-in. Use Get Started to see the onboarding.</p>
            <Button className="mt-6 w-full" onClick={onClose}>Close</Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}