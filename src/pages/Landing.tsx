import Button from '../components/Button'
import Logo from '../components/Logo'
import Reveal from '../components/Reveal'
import SmartImage from '../components/SmartImage'
import { brand, images } from '../data/brand'

export default function Landing() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <Logo />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Setup test</p>
        <h1 className="mt-3 text-4xl font-extrabold text-forest sm:text-5xl">{brand.tagline}</h1>
      </Reveal>
      <div className="flex flex-wrap gap-3">
        <Button to="/onboarding">Get Started</Button>
        <Button variant="outline" href="#img">Explore Platform</Button>
        <span className="rounded-lg bg-forest px-3 py-2"><Button variant="light">Light</Button></span>
      </div>
      <SmartImage src={images.hero} alt="Corporate headquarters" className="h-64 w-full rounded-2xl shadow-card" />
    </main>
  )
}