'use client'

import {
  Activity,
  CalendarPlus,
  CalendarClock,
  Fingerprint,
  Plus,
  Search,
  ShieldAlert,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AddClientModal } from '@/components/add-client-modal'
import { ConfigPanel } from '@/components/config-panel'
import { LicenseInspector } from '@/components/license-inspector'
import { Button } from '@/components/ui/button'
import {
  addDays,
  daysUntil,
  INITIAL_CLIENTS,
  toISODate,
  type Client,
} from '@/lib/legion'

export function Dashboard() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS)
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [inspecting, setInspecting] = useState<Client | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.deviceId.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q),
    )
  }, [clients, query])

  const activos = clients.filter((c) => c.status === 'activo').length
  const pendientes = clients.length - activos

  function toggleStatus(id: string) {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'activo' ? 'pendiente' : 'activo' }
          : c,
      ),
    )
  }

  function extend30(id: string) {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const base =
          daysUntil(c.nextBlock) < 0 ? toISODate(new Date()) : c.nextBlock
        return { ...c, nextBlock: addDays(base, 30), status: 'activo' }
      }),
    )
  }

  function addClient(data: {
    name: string
    location: string
    deviceId: string
  }) {
    setClients((prev) => [
      {
        id: crypto.randomUUID(),
        deviceId: data.deviceId,
        name: data.name,
        location: data.location,
        status: 'activo',
        nextBlock: addDays(toISODate(new Date()), 30),
        lastSeen: 'Nuevo',
      },
      ...prev,
    ])
  }

  return (
    <div className="cyber-grid min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/legion-xp.png"
              alt="Legión XP"
              width={52}
              height={52}
              className="size-12 object-contain drop-shadow-[0_0_12px_oklch(0.62_0.24_25_/_0.55)]"
            />
            <div>
              <h1 className="neon-text font-mono text-xl font-extrabold tracking-widest text-foreground">
                LEGION XP
              </h1>
              <p className="text-xs font-light tracking-[0.35em] text-muted-foreground">
                ADMIN PANEL
              </p>
            </div>
          </div>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-primary text-primary-foreground glow-red hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Añadir cliente
          </Button>
        </header>

        {/* Stats */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users className="size-5" />}
            label="Dispositivos totales"
            value={clients.length}
            tone="neutral"
          />
          <StatCard
            icon={<Activity className="size-5" />}
            label="Licencias activas"
            value={activos}
            tone="green"
          />
          <StatCard
            icon={<ShieldAlert className="size-5" />}
            label="Pendientes / bloqueados"
            value={pendientes}
            tone="red"
          />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Clients table */}
          <section className="rounded-xl border border-border bg-card/60 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
                Clientes activos
              </h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar device / nombre…"
                  className="cyber-input w-56 pl-8 text-xs"
                />
              </div>
            </div>

            <div className="divide-y divide-border">
              {filtered.map((c) => (
                <ClientRow
                  key={c.id}
                  client={c}
                  onToggle={() => toggleStatus(c.id)}
                  onExtend={() => extend30(c.id)}
                  onInspect={() => setInspecting(c)}
                />
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Sin resultados para “{query}”.
                </p>
              )}
            </div>
          </section>

          <ConfigPanel />
        </div>
      </div>

      <AddClientModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addClient}
        existing={clients}
      />
      <LicenseInspector
        client={inspecting}
        onClose={() => setInspecting(null)}
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: 'neutral' | 'green' | 'red'
}) {
  const toneClass =
    tone === 'green'
      ? 'text-[oklch(0.78_0.18_145)]'
      : tone === 'red'
        ? 'text-primary'
        : 'text-accent'
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur">
      <span
        className={`flex size-11 items-center justify-center rounded-lg bg-secondary/60 ${toneClass}`}
      >
        {icon}
      </span>
      <div>
        <p className={`font-mono text-2xl font-bold ${toneClass}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function ClientRow({
  client,
  onToggle,
  onExtend,
  onInspect,
}: {
  client: Client
  onToggle: () => void
  onExtend: () => void
  onInspect: () => void
}) {
  const isActive = client.status === 'activo'
  const remaining = daysUntil(client.nextBlock)
  const expired = remaining < 0

  return (
    <div className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-secondary/30 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-foreground">
            {client.deviceId}
          </span>
          <StatusBadge active={isActive} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {client.name} · {client.location} · {client.lastSeen}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <CalendarClock
          className={`size-4 ${expired ? 'text-primary' : 'text-muted-foreground'}`}
        />
        <span className={expired ? 'text-primary' : 'text-foreground'}>
          {client.nextBlock}
          <span className="ml-1 text-muted-foreground">
            ({expired ? 'vencido' : `${remaining}d`})
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onInspect}
          title="Ver respuesta / firma"
          className="flex size-8 items-center justify-center rounded-md border border-border text-accent transition-colors hover:bg-accent/10"
        >
          <Fingerprint className="size-4" />
        </button>
        <button
          onClick={onExtend}
          title="Extender 30 días"
          className="flex size-8 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
        >
          <CalendarPlus className="size-4" />
        </button>
        <Toggle active={isActive} onClick={onToggle} />
      </div>
    </div>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
        active
          ? 'border-[oklch(0.7_0.18_145)]/50 bg-[oklch(0.7_0.18_145)]/10 text-[oklch(0.8_0.18_145)] glow-green'
          : 'border-primary/50 bg-primary/10 text-primary glow-red'
      }`}
    >
      {active ? 'Activo' : 'Pendiente'}
    </span>
  )
}

function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={active}
      title={active ? 'Bloquear' : 'Activar'}
      className={`relative h-6 w-11 rounded-full border transition-colors ${
        active
          ? 'border-[oklch(0.7_0.18_145)]/60 bg-[oklch(0.7_0.18_145)]/25 glow-green'
          : 'border-primary/60 bg-primary/20'
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full transition-all ${
          active
            ? 'left-[22px] bg-[oklch(0.8_0.18_145)]'
            : 'left-0.5 bg-primary'
        }`}
      />
    </button>
  )
}
