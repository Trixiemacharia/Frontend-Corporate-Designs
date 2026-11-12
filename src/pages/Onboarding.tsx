import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Button from '../components/Button'
import DemoDialog from '../components/DemoDialog'
import OnboardingShell from '../components/OnboardingShell'
import { useCurtain } from '../components/CurtainProvider'
import { StepAccount, StepConfirm, StepOrg, StepPrefs, StepRole } from '../onboarding/steps'
import { initialData, validate, type Data, type Errors } from '../lib/validation'

export default function Onboarding() {
  const { go } = useCurtain()
  const [data, setData] = useState<Data>(initialData)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)
  const [fromConfirm, setFromConfirm] = useState(false)
  const [signIn, setSignIn] = useState(false)
  const focusRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    focusRef.current?.focus()
  }, [step, done])

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData(d => ({ ...d, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }
  const next = () => {
    const e = validate(step, data)
    setErrors(e)
    if (Object.keys(e).length) return
    if (fromConfirm) { setFromConfirm(false); setStep(4) } else setStep(s => s + 1)
  }
  const back = () => {
    setErrors({})
    if (fromConfirm) { setFromConfirm(false); setStep(4) } else setStep(s => Math.max(0, s - 1))
  }
  const edit = (s: number) => { setFromConfirm(true); setStep(s) }

  const props = { data, set, errors }
  const screens = [<StepAccount {...props} />, <StepOrg {...props} />, <StepRole {...props} />, <StepPrefs {...props} />, <StepConfirm data={data} onEdit={edit} />]
  const first = data.name.trim().split(/\s+/)[0]
  const canGoBack = step > 0 || fromConfirm

  return (
    <OnboardingShell current={step} done={done} onSignIn={() => setSignIn(true)}>
      <div ref={focusRef} tabIndex={-1} className="outline-none">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="py-4 text-center">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.15 }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-forest text-mint"><Check size={38} strokeWidth={3} /></motion.div>
              <h1 className="mt-6 text-2xl font-extrabold text-forest">Your workspace is ready{first ? `, ${first}` : ''}.</h1>
              <p className="mx-auto mt-3 max-w-sm text-sm text-charcoal/65">Thank you for completing setup for {data.org || 'your organisation'}. This is a prototype, so no real account was created.</p>
              <Button className="mt-7 w-full" onClick={() => go('/')}>Back to home</Button>
            </motion.div>
          ) : (
            <motion.form key={step} noValidate
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}
              onSubmit={ev => { ev.preventDefault(); step === 4 ? setDone(true) : next() }}>
              {screens[step]}
              <Button type="submit" className="mt-7 w-full">
                {step === 4 ? 'Create account' : fromConfirm ? 'Save and review' : 'Continue'} {step !== 4 && <ArrowRight size={16} />}
              </Button>
              <div className="mt-3 text-center">
                {canGoBack
                  ? <button type="button" onClick={back} className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"><ArrowLeft size={14} /> Back</button>
                  : <button type="button" onClick={() => go('/')} className="text-sm font-semibold text-forest hover:underline">Cancel</button>}
              </div>
              {(step === 0 || step === 4) && (
                <p className="mt-5 text-center text-[11px] leading-relaxed text-charcoal/50">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <DemoDialog open={signIn} onClose={() => setSignIn(false)} />
    </OnboardingShell>
  )
}