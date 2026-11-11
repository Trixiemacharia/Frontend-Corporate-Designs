import { MotionConfig } from 'framer-motion'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CurtainProvider } from './components/CurtainProvider'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CurtainProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CurtainProvider>
    </MotionConfig>
  )
}