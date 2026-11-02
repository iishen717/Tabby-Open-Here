/**
 * Open Here 纯工具函数
 * 功能描述：路径解析、注册表参数构造、待处理请求校验、Profile 过滤
 * 说明：不依赖 Angular / Tabby，便于 Node 单元测试
 */
import * as path from 'path'

export const APP_PATHS_KEY = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\tabby.exe'
export const APP_PATHS_MARKER_NAME = 'OpenHereMarker'
export const APP_PATHS_MARKER_VALUE = 'tabby-open-here'
export const CONTEXT_MENU_KEY_ROOTS = [
  'HKCU\\Software\\Classes\\Directory\\shell\\TabbyOpenHere',
  'HKCU\\Software\\Classes\\Directory\\Background\\shell\\TabbyOpenHere',
  'HKCU\\Software\\Classes\\Drive\\shell\\TabbyOpenHere',
  'HKCU\\Software\\Classes\\Drive\\Background\\shell\\TabbyOpenHere',
]
export const PENDING_KEY = 'oh-pending-open'
export const PENDING_TTL_MS = 10000

export interface LocalProfileLike {
  id?: string
  name?: string
  type?: string
  isBuiltin?: boolean
  options?: { fsBase?: string | null }
}

export interface PendingOpenRequest {
  path: string
  ts: number
  id: string
}

export function resolveOpenTarget(cwd: string, directory?: string | null): string {
  return path.resolve(cwd || '.', directory || '.')
}

export function normalizeTabbyPath(value: string | null | undefined): string | null {
  if (!value) return null
  let result = String(value).trim()
  if (result.length >= 2 && result.startsWith('"') && result.endsWith('"')) {
    result = result.slice(1, -1).trim()
  }
  return result || null
}

export function parseTabbyPathFromProtocolCommand(command: string | null | undefined): string | null {
  if (!command) return null
  const text = command.trim()
  if (!text) return null
  if (text[0] === '"') {
    const end = text.indexOf('"', 1)
    return end > 1 ? text.slice(1, end) : null
  }
  const match = /^([^\s]+)/.exec(text)
  return match ? match[1] : null
}

export function parseRegDefaultValue(output: string | null | undefined): string | null {
  if (!output) return null
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/\s(?:REG_SZ|REG_EXPAND_SZ)\s+(.*)$/)
    if (match && match[1].trim()) return match[1].trim()
  }
  return null
}

export function buildAppPathsRegArgs(launcherPath: string): string[][] {
  return [
    ['add', APP_PATHS_KEY, '/ve', '/d', launcherPath, '/f'],
    ['add', APP_PATHS_KEY, '/v', APP_PATHS_MARKER_NAME, '/d', APP_PATHS_MARKER_VALUE, '/f'],
  ]
}

export function buildContextMenuCommand(launcherPath: string): string {
  return `"${launcherPath}" "%V"`
}

export function buildContextMenuRegArgs(launcherPath: string, tabbyPath: string, label: string): string[][] {
  const result: string[][] = []
  for (const root of CONTEXT_MENU_KEY_ROOTS) {
    result.push(['add', root, '/ve', '/d', label, '/f'])
    result.push(['add', root, '/v', 'Icon', '/d', `"${tabbyPath}"`, '/f'])
    result.push(['add', `${root}\\command`, '/ve', '/d', buildContextMenuCommand(launcherPath), '/f'])
  }
  return result
}

export function parsePendingRequest(
  raw: string | null | undefined,
  now: number,
  ttl: number = PENDING_TTL_MS
): PendingOpenRequest | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw)
    if (!value || typeof value.path !== 'string' || !value.path) return null
    if (typeof value.ts !== 'number' || !isFinite(value.ts)) return null
    if (value.ts > now + 60000) return null
    if (now - value.ts > ttl) return null
    return {
      path: value.path,
      ts: value.ts,
      id: typeof value.id === 'string' ? value.id : '',
    }
  } catch {
    return null
  }
}

export function getSelectableProfiles<T extends LocalProfileLike>(profiles: T[]): T[] {
  return (profiles || []).filter(profile =>
    !!profile &&
    profile.type === 'local' &&
    !(profile.options && profile.options.fsBase)
  )
}

export function resolveDefaultProfile<T extends LocalProfileLike>(
  profiles: T[],
  configuredId?: string | null
): T | null {
  const selectable = getSelectableProfiles(profiles)
  if (configuredId) {
    const configured = selectable.find(profile => profile.id === configuredId)
    if (configured) return configured
  }
  return selectable.find(profile => profile.isBuiltin) || selectable[0] || null
}

export function findProfileById<T extends LocalProfileLike>(profiles: T[], id: string): T | null {
  return getSelectableProfiles(profiles).find(profile => profile.id === id) || null
}
