export const SECRET_KEY = 'LegionXP_Secret_Key_2026'

export type ClientStatus = 'activo' | 'pendiente'

export type Client = {
  id: string
  deviceId: string
  name: string
  location: string
  status: ClientStatus
  nextBlock: string // YYYY-MM-DD
  lastSeen: string
}

export type LicenseResponse = {
  bloqueado: boolean
  proximo_bloqueo: string
  firma: string
}

/** Format a Date to YYYY-MM-DD */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Add N days to a YYYY-MM-DD string */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return toISODate(d)
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00Z').getTime()
  const now = new Date(toISODate(new Date()) + 'T00:00:00Z').getTime()
  return Math.round((target - now) / 86_400_000)
}

/**
 * Compute the SHA-256 signature the client app verifies.
 * firma = SHA256(Device_ID + proximo_bloqueo + SECRET_KEY)
 */
export async function computeSignature(
  deviceId: string,
  proximoBloqueo: string,
): Promise<string> {
  const payload = `${deviceId}${proximoBloqueo}${SECRET_KEY}`
  const data = new TextEncoder().encode(payload)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Build the full JSON response the HTTP endpoint would return. */
export async function buildLicenseResponse(
  client: Client,
): Promise<LicenseResponse> {
  const bloqueado = client.status !== 'activo' || daysUntil(client.nextBlock) < 0
  const firma = await computeSignature(client.deviceId, client.nextBlock)
  return {
    bloqueado,
    proximo_bloqueo: client.nextBlock,
    firma,
  }
}

/** Validate the strict [HARDWARE_MODEL]-LXP device id pattern. */
export const DEVICE_ID_PATTERN = /^[A-Z0-9]+(?:-[A-Z0-9]+)*-LXP$/

export function isValidDeviceId(value: string): boolean {
  return DEVICE_ID_PATTERN.test(value.trim().toUpperCase())
}

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    deviceId: 'GALAXY-S20-LXP',
    name: 'Carlos Méndez',
    location: 'Madrid, ES',
    status: 'activo',
    nextBlock: addDays(toISODate(new Date()), 22),
    lastSeen: 'Hace 4 min',
  },
  {
    id: 'c2',
    deviceId: 'REDMI-NOTE12-LXP',
    name: 'Ana Torres',
    location: 'Bogotá, CO',
    status: 'activo',
    nextBlock: addDays(toISODate(new Date()), 8),
    lastSeen: 'Hace 1 h',
  },
  {
    id: 'c3',
    deviceId: 'PIXEL-7PRO-LXP',
    name: 'Diego Ramírez',
    location: 'Lima, PE',
    status: 'pendiente',
    nextBlock: addDays(toISODate(new Date()), -2),
    lastSeen: 'Hace 3 días',
  },
  {
    id: 'c4',
    deviceId: 'MOTO-G84-LXP',
    name: 'Lucía Fernández',
    location: 'CDMX, MX',
    status: 'activo',
    nextBlock: addDays(toISODate(new Date()), 30),
    lastSeen: 'Hace 12 min',
  },
  {
    id: 'c5',
    deviceId: 'ONEPLUS-11-LXP',
    name: 'Mateo Silva',
    location: 'Santiago, CL',
    status: 'pendiente',
    nextBlock: addDays(toISODate(new Date()), 1),
    lastSeen: 'Hace 2 h',
  },
]
