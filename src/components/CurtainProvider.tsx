import { createContext, useContext, useState, type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { brand } from '../data/brand'

type Phase = 'idle' | 'in' | 'out'
const Ctx = createContext<{ go: (to: string) => void }>({ go: () => {} })
export const useCurtain = () => useContext(Ctx)

const ease: [number, number, number, number] = [0.7, 0, 0.2, 1]
const variants: Variants = {
  idle: { x: '-100%', transition: { duration: 0 } },
  in: { x: '0%', transition: { duration: 0.55, ease } },
  out: { x: '100%', transition: { duration: 0.55, ease } },
}

export function CurtainProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('idle')
  const [target, setTarget] = useState('/')

  const go = (to: string) => {
    if (phase !== 'idle') return
    setTarget(to)
    setPhase('in')
  }

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <motion.div
        aria-hidden="true"
        className={`fixed inset-0 z-[100] bg-forest ${phase === 'idle' ? 'pointer-events-none' : ''}`}
        variants={variants} initial="idle" animate={phase}
        onAnimationComplete={def => {
          if (def === 'in') { navigate(target); window.scrollTo(0, 0); setPhase('out') }
          else if (def === 'out') setPhase('idle')
        }}
      >
        <div className="grid h-full place-items-center">
          <span className="text-2xl font-extrabold tracking-tight text-white">{brand.name}</span>
        </div>
      </motion.div>
    </Ctx.Provider>
  )
}