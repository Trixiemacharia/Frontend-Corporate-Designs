import Button from '../components/Button'

export default function Onboarding() {
  return (
    <main className="grid min-h-screen place-content-center gap-4 text-center">
      <h1 className="text-3xl font-extrabold text-forest">Onboarding route works</h1>
      <Button to="/" variant="outline">Back to landing</Button>
    </main>
  )
}