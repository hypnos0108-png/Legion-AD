'use client'

import { Globe, Network, Radio, Save, Server } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ConfigPanel() {
  const [domain, setDomain] = useState('legionxp-admin.duckdns.org')
  const [token, setToken] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur">
        <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Server className="size-4 text-accent" />
          Estado del servidor
        </h3>
        <div className="space-y-3">
          <StatusRow
            icon={<Radio className="size-4" />}
            label="Servidor"
            value="Online"
            online
          />
          <StatusRow
            icon={<Network className="size-4" />}
            label="IP local"
            value="192.168.1.42"
          />
          <StatusRow
            icon={<Globe className="size-4" />}
            label="Endpoint"
            value=":8080 / verificar"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur">
        <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Globe className="size-4 text-accent" />
          Sincronización DuckDNS
        </h3>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Dominio
            </span>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="cyber-input font-mono text-xs"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Token
            </span>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="••••••••-••••-••••"
              className="cyber-input font-mono text-xs"
            />
          </label>
          <Button
            onClick={handleSave}
            className="w-full bg-accent text-accent-foreground glow-teal hover:bg-accent/90"
          >
            <Save className="size-4" />
            {saved ? 'Guardado ✓' : 'Guardar y sincronizar IP'}
          </Button>
        </div>
      </div>
    </aside>
  )
}

function StatusRow({
  icon,
  label,
  value,
  online,
}: {
  icon: React.ReactNode
  label: string
  value: string
  online?: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 bg-secondary/40 px-3 py-2">
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="flex items-center gap-2 font-mono text-xs text-foreground">
        {online && (
          <span className="size-2 rounded-full bg-[oklch(0.7_0.18_145)] glow-green" />
        )}
        {value}
      </span>
    </div>
  )
}
