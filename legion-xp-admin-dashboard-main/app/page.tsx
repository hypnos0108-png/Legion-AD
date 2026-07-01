'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/dashboard'
import { SplashScreen } from '@/components/splash-screen'

export default function Page() {
  const [ready, setReady] = useState(false)

  return (
    <main className="min-h-screen bg-background text-foreground">
      {!ready && <SplashScreen onDone={() => setReady(true)} />}
      <Dashboard />
    </main>
  )
}
