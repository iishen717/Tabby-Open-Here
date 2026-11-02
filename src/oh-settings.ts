/**
 * Open Here 本地设置
 * 使用 localStorage，与参考插件保持一致
 */
export type OpenMode = 'tab' | 'window'

const PATH_KEY = 'oh-tabby-path'
const PROFILE_KEY = 'oh-profile'
const MODE_KEY = 'oh-open-mode'

function read(key: string): string {
  try { return localStorage.getItem(key) || '' } catch { return '' }
}

function write(key: string, value: string): void {
  try { localStorage.setItem(key, value) } catch {}
}

export function getTabbyPath(): string {
  return read(PATH_KEY)
}

export function setTabbyPath(value: string): void {
  write(PATH_KEY, value || '')
}

export function getProfileSelection(): string {
  return read(PROFILE_KEY) || 'default'
}

export function setProfileSelection(value: string): void {
  write(PROFILE_KEY, value || 'default')
}

export function getOpenMode(): OpenMode {
  return read(MODE_KEY) === 'window' ? 'window' : 'tab'
}

export function setOpenMode(value: OpenMode): void {
  write(MODE_KEY, value === 'window' ? 'window' : 'tab')
}
