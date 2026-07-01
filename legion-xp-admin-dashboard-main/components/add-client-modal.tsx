'use client'

import { CheckCircle2, Cpu, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { isValidDeviceId, type Client } from '@/lib/legion'

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (data: { name: string; location: string; deviceId: string }) => void
  existing: Client[]
}

export function AddClientModal({ open, onClose, onAdd, existing }: Props) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const normalizedId = deviceId.trim().toUpperCase()
  const idValid = isValidDeviceId(normalizedId)

  function reset() {
    setName('')
    setLocation('')
    setDeviceId('')
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('El nombre del cliente es obligatorio.')
    if (!idValid)
      return setError('El Device ID debe seguir el patrón [MODELO]-LXP.')
    if (existing.some((c) => c.deviceId === normalizedId))
      return setError('Ese Device ID ya está registrado.')

    onAdd({
      name: name.trim(),
      location: location.trim() || 'Sin ubicación',
      deviceId: normalizedId,
    })
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Cerrar"
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="neon-border animate-fade-up relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-card/90 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-primary glow-red">
              <UserPlus className="size-4" />
            </span>
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
              Añadir Cliente
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <Field label="Nombre del cliente">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Carlos Méndez"
              className="cyber-input"
            />
          </Field>

          <Field label="Ubicación (opcional)">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Madrid, ES"
              className="cyber-input"
            />
          </Field>

          <Field label="Device ID único">
            <div className="relative">
              <Cpu className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value.toUpperCase())}
                placeholder="GALAXY-S20-LXP"
                className="cyber-input pl-9 font-mono uppercase tracking-wider"
              />
              {deviceId && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {idValid ? (
                    <CheckCircle2 className="size-4 text-[oklch(0.7_0.18_145)]" />
                  ) : (
                    <span className="size-2 rounded-full bg-primary glow-red" />
                  )}
                </span>
              )}
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
              Patrón: {'[HARDWARE_MODEL]-LXP'}
            </p>
          </Field>

          {error && (
            <p className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border bg-transparent text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground glow-red hover:bg-primary/90"
            >
              Registrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}
