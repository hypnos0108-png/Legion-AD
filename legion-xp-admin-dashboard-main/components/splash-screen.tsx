'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const fade = setTimeout(() => setLeaving(true), 2100)
    const done = setTimeout(onDone, 2600)
    return () => {
      clearTimeout(fade)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <div
      className={`cyber-grid fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-x-0 h-24 animate-scan bg-primary/10 blur-xl" />
      </div>

      <div className="animate-pulse-glow relative">
        <Image
          src="/legion-xp.png"
          alt="Legión XP"
          width={160}
          height={160}
          priority
          className="h-40 w-40 object-contain"
        />
      </div>

      <h1 className="neon-text mt-6 font-mono text-4xl font-extrabold tracking-[0.2em] text-foreground">
        LEGION XP
      </h1>
      <p className="mt-2 text-sm font-light tracking-[0.5em] text-muted-foreground">
        ADMIN
      </p>

      <div className="mt-10 h-0.5 w-48 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/3 animate-loadbar bg-primary glow-red" />
      </div>
      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Inicializando núcleo seguro…
      </p>
    </div>
  )
}
