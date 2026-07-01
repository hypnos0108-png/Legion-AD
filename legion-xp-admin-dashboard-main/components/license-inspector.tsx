'use client'

import { Fingerprint, ShieldCheck, ShieldX, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  buildLicenseResponse,
  SECRET_KEY,
  type Client,
  type LicenseResponse,
} from '@/lib/legion'

export function LicenseInspector({
  client,
  onClose,
}: {
  client: Client | null
  onClose: () => void
}) {
  const [res, setRes] = useState<LicenseResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!client) return
    setLoading(true)
    setRes(null)
    buildLicenseResponse(client).then((r) => {
      setRes(r)
      setLoading(false)
    })
  }, [client])

  if (!client) return null

  const json = res
    ? JSON.stringify(res, null, 2)
    : '{\n  "estado": "calculando firma…"\n}'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Cerrar"
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="neon-border animate-fade-up relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card/90 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-accent/15 text-accent glow-teal">
              <Fingerprint className="size-4" />
            </span>
            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
                Respuesta del endpoint
              </h2>
              <p className="font-mono text-[11px] text-muted-foreground">
                GET /verificar?id={client.deviceId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
              res?.bloqueado
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-[oklch(0.7_0.18_145)]/40 bg-[oklch(0.7_0.18_145)]/10 text-[oklch(0.78_0.18_145)]'
            }`}
          >
            {res?.bloqueado ? (
              <ShieldX className="size-5" />
            ) : (
              <ShieldCheck className="size-5" />
            )}
            <span className="font-mono text-sm font-semibold">
              {loading
                ? 'Verificando…'
                : res?.bloqueado
                  ? 'Licencia BLOQUEADA'
                  : 'Licencia ACTIVA y firmada'}
            </span>
          </div>

          <pre className="overflow-x-auto rounded-lg border border-border bg-[oklch(0.1_0.01_264)] p-4 font-mono text-xs leading-relaxed text-accent">
            <code>{json}</code>
          </pre>

          <div className="rounded-lg border border-border/60 bg-secondary/40 p-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Cálculo de la firma (SHA-256)
            </p>
            <p className="mt-1.5 break-all font-mono text-[11px] text-foreground/80">
              SHA256( <span className="text-accent">{client.deviceId}</span> +{' '}
              <span className="text-accent">{client.nextBlock}</span> +{' '}
              <span className="text-primary">{SECRET_KEY}</span> )
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
