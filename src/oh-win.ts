/**
 * Windows 集成
 * 功能描述：启动器写入、App Paths / 右键菜单注册表安装卸载、状态检测、Tabby 路径检测
 */
import { execFile } from 'child_process'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import {
  APP_PATHS_KEY,
  APP_PATHS_MARKER_NAME,
  APP_PATHS_MARKER_VALUE,
  CONTEXT_MENU_KEY_ROOTS,
  buildAppPathsRegArgs,
  buildContextMenuRegArgs,
  normalizeTabbyPath,
  parseRegDefaultValue,
  parseTabbyPathFromProtocolCommand,
} from './oh-util'
import { LAUNCHER_EXE_BASE64, LAUNCHER_VERSION } from './oh-launcher-exe'

export interface IntegrationStatus {
  installed: boolean
  needsRepair: boolean
  appPathOccupied: boolean
  appPathExists: boolean
  launcherExists: boolean
  pathFileExists: boolean
  versionFileExists: boolean
  contextMenuCount: number
  baseDir: string
  launcherPath: string
}

interface RegResult {
  code: number
  stdout: string
  stderr: string
}

function decodeOutput(buffer: Buffer): string {
  try {
    return new TextDecoder('gbk').decode(buffer)
  } catch {
    return buffer.toString('utf8')
  }
}

function runReg(args: string[]): Promise<RegResult> {
  return new Promise(resolve => {
    execFile('reg.exe', args, { windowsHide: true, encoding: 'buffer' }, (error: any, stdout: any, stderr: any) => {
      const code = error ? (typeof error.code === 'number' ? error.code : 1) : 0
      resolve({
        code,
        stdout: decodeOutput(Buffer.isBuffer(stdout) ? stdout : Buffer.from(String(stdout || ''))),
        stderr: decodeOutput(Buffer.isBuffer(stderr) ? stderr : Buffer.from(String(stderr || ''))),
      })
    })
  })
}

async function runRegOrThrow(args: string[]): Promise<void> {
  const result = await runReg(args)
  if (result.code !== 0) {
    const detail = (result.stderr || result.stdout || '').trim()
    throw new Error(`注册表操作失败 (${args[0]}): ${detail || 'reg.exe exit ' + result.code}`)
  }
}

export function getBaseDir(): string {
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local')
  return path.join(localAppData, 'TabbyOpenHere')
}

export function getLauncherPath(): string {
  return path.join(getBaseDir(), 'tabby.exe')
}

export function getPathFile(): string {
  return path.join(getBaseDir(), 'tabby-path.txt')
}

export function getVersionFile(): string {
  return path.join(getBaseDir(), 'launcher-version.txt')
}

export function tabbyPathExists(value: string): boolean {
  const normalized = normalizeTabbyPath(value)
  return !!normalized && /\.exe$/i.test(normalized) && fs.existsSync(normalized)
}

export function ensureLauncher(): void {
  if (!LAUNCHER_EXE_BASE64) {
    throw new Error('启动器未构建，请先运行 npm run build:launcher。')
  }
  fs.mkdirSync(getBaseDir(), { recursive: true })
  let current = ''
  try {
    current = fs.readFileSync(getVersionFile(), 'utf8').trim()
  } catch {}
  if (current !== LAUNCHER_VERSION || !fs.existsSync(getLauncherPath())) {
    fs.writeFileSync(getLauncherPath(), Buffer.from(LAUNCHER_EXE_BASE64, 'base64'))
    fs.writeFileSync(getVersionFile(), LAUNCHER_VERSION, 'utf8')
  }
}

export function writeTabbyPath(tabbyPath: string): void {
  const normalized = normalizeTabbyPath(tabbyPath)
  if (!normalized) throw new Error('Tabby 路径为空。')
  fs.mkdirSync(getBaseDir(), { recursive: true })
  fs.writeFileSync(getPathFile(), normalized, 'utf8')
}

export async function getStatus(): Promise<IntegrationStatus> {
  const baseDir = getBaseDir()
  const launcherPath = getLauncherPath()
  const launcherExists = fs.existsSync(launcherPath)
  const pathFileExists = fs.existsSync(getPathFile())
  const versionFileExists = fs.existsSync(getVersionFile())

  const appPathExists = (await runReg(['query', APP_PATHS_KEY, '/ve'])).code === 0
  const marker = await runReg(['query', APP_PATHS_KEY, '/v', APP_PATHS_MARKER_NAME])
  const ours = marker.code === 0 && marker.stdout.includes(APP_PATHS_MARKER_VALUE)

  let contextMenuCount = 0
  for (const key of CONTEXT_MENU_KEY_ROOTS) {
    if ((await runReg(['query', key, '/ve'])).code === 0) contextMenuCount++
  }

  const installed = launcherExists && pathFileExists && versionFileExists && ours &&
    contextMenuCount === CONTEXT_MENU_KEY_ROOTS.length
  const needsRepair = !installed &&
    (launcherExists || pathFileExists || versionFileExists || ours || contextMenuCount > 0)

  return {
    installed,
    needsRepair,
    appPathOccupied: appPathExists && !ours,
    appPathExists,
    launcherExists,
    pathFileExists,
    versionFileExists,
    contextMenuCount,
    baseDir,
    launcherPath,
  }
}

export async function install(options: { tabbyPath: string; contextLabel: string }): Promise<void> {
  const tabbyPath = normalizeTabbyPath(options.tabbyPath)
  if (!tabbyPath) throw new Error('Tabby 路径为空。')
  if (!/\.exe$/i.test(tabbyPath)) throw new Error('请选择 Tabby.exe。')
  if (!fs.existsSync(tabbyPath)) throw new Error(`Tabby.exe 不存在：${tabbyPath}`)

  ensureLauncher()
  writeTabbyPath(tabbyPath)

  for (const args of buildAppPathsRegArgs(getLauncherPath())) {
    await runRegOrThrow(args)
  }
  for (const args of buildContextMenuRegArgs(getLauncherPath(), tabbyPath, options.contextLabel)) {
    await runRegOrThrow(args)
  }
}

export async function updateTabbyPath(tabbyPath: string): Promise<void> {
  const normalized = normalizeTabbyPath(tabbyPath)
  if (!normalized) throw new Error('Tabby 路径为空。')
  if (!/\.exe$/i.test(normalized)) throw new Error('请选择 Tabby.exe。')
  if (!fs.existsSync(normalized)) throw new Error(`Tabby.exe 不存在：${normalized}`)

  ensureLauncher()
  writeTabbyPath(normalized)
  for (const root of CONTEXT_MENU_KEY_ROOTS) {
    await runRegOrThrow(['add', root, '/v', 'Icon', '/d', `"${normalized}"`, '/f'])
  }
}

export async function uninstall(): Promise<void> {
  const marker = await runReg(['query', APP_PATHS_KEY, '/v', APP_PATHS_MARKER_NAME])
  if (marker.code === 0 && marker.stdout.includes(APP_PATHS_MARKER_VALUE)) {
    await runReg(['delete', APP_PATHS_KEY, '/f'])
  }
  for (const key of CONTEXT_MENU_KEY_ROOTS) {
    await runReg(['delete', key, '/f'])
  }
  try {
    fs.rmSync(getBaseDir(), { recursive: true, force: true })
  } catch {}
}

export async function detectTabbyPath(): Promise<string> {
  const execPath = (process as any).execPath || ''
  if (/tabby\.exe$/i.test(execPath) && fs.existsSync(execPath)) {
    return execPath
  }

  const protocol = await runReg(['query', 'HKCU\\Software\\Classes\\tabby\\shell\\open\\command', '/ve'])
  if (protocol.code === 0) {
    const command = parseRegDefaultValue(protocol.stdout)
    const parsed = parseTabbyPathFromProtocolCommand(command)
    if (parsed && fs.existsSync(parsed)) return parsed
  }

  const candidates = [
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Programs', 'tabby', 'Tabby.exe') : '',
    process.env.ProgramFiles ? path.join(process.env.ProgramFiles, 'Tabby', 'Tabby.exe') : '',
    process.env['ProgramFiles(x86)'] ? path.join(process.env['ProgramFiles(x86)'], 'Tabby', 'Tabby.exe') : '',
  ].filter(Boolean)
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }
  return execPath
}
