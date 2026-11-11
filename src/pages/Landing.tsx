import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TrustSection from '../components/TrustSection'
import Capabilities from '../components/Capabilities'
import WhyUs from '../components/WhyUs'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'
import DemoDialog from '../components/DemoDialog'

export default function Landing() {
  const [dlg, setDlg] = useState(false)
  return (
    <>
      <Navbar onSignIn={() => setDlg(true)} />
      <main>
        <Hero />
        <TrustSection />
        <Capabilities />
        <WhyUs />
        <FinalCTA />
      </main>
      <Footer />
      <DemoDialog open={dlg} onClose={() => setDlg(false)} />
    </>
  )
}