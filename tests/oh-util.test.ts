import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as path from 'node:path'
import {
  APP_PATHS_KEY,
  APP_PATHS_MARKER_NAME,
  APP_PATHS_MARKER_VALUE,
  CONTEXT_MENU_KEY_ROOTS,
  resolveOpenTarget,
  normalizeTabbyPath,
  parseTabbyPathFromProtocolCommand,
  parseRegDefaultValue,
  buildAppPathsRegArgs,
  buildContextMenuCommand,
  buildContextMenuRegArgs,
  parsePendingRequest,
  getSelectableProfiles,
  resolveDefaultProfile,
  findProfileById,
} from '../src/oh-util'

test('resolveOpenTarget 使用显式目录', () => {
  assert.equal(resolveOpenTarget('C:\\work', 'sub'), path.resolve('C:\\work', 'sub'))
  assert.equal(resolveOpenTarget('C:\\work', 'D:\\other'), path.resolve('D:\\other'))
})

test('resolveOpenTarget 没有目录时使用 cwd', () => {
  assert.equal(resolveOpenTarget('C:\\work'), path.resolve('C:\\work', '.'))
  assert.equal(resolveOpenTarget('C:\\work', ''), path.resolve('C:\\work', '.'))
})

test('normalizeTabbyPath 去空格和成对引号', () => {
  assert.equal(normalizeTabbyPath('  "D:\\Tools\\tabby\\Tabby.exe"  '), 'D:\\Tools\\tabby\\Tabby.exe')
  assert.equal(normalizeTabbyPath('D:\\Tools\\tabby\\Tabby.exe'), 'D:\\Tools\\tabby\\Tabby.exe')
  assert.equal(normalizeTabbyPath('   '), null)
  assert.equal(normalizeTabbyPath(null), null)
})

test('parseTabbyPathFromProtocolCommand 解析引号与无引号命令', () => {
  assert.equal(
    parseTabbyPathFromProtocolCommand('"D:\\Tools\\tabby\\Tabby.exe" "%1"'),
    'D:\\Tools\\tabby\\Tabby.exe'
  )
  assert.equal(
    parseTabbyPathFromProtocolCommand('D:\\Tools\\tabby\\Tabby.exe "%1"'),
    'D:\\Tools\\tabby\\Tabby.exe'
  )
  assert.equal(parseTabbyPathFromProtocolCommand(''), null)
  assert.equal(parseTabbyPathFromProtocolCommand(null), null)
})

test('parseRegDefaultValue 从 reg query 输出提取值', () => {
  const output = [
    '',
    'HKEY_CURRENT_USER\\Software\\Classes\\tabby\\shell\\open\\command',
    '    (默认)    REG_SZ    "D:\\Tools\\tabby\\Tabby.exe" "%1"',
    '',
  ].join('\r\n')
  assert.equal(parseRegDefaultValue(output), '"D:\\Tools\\tabby\\Tabby.exe" "%1"')
  assert.equal(parseRegDefaultValue(''), null)
})

test('buildAppPathsRegArgs 生成默认值与标记', () => {
  const args = buildAppPathsRegArgs('C:\\Apps\\TabbyOpenHere\\tabby.exe')
  assert.deepEqual(args[0], ['add', APP_PATHS_KEY, '/ve', '/d', 'C:\\Apps\\TabbyOpenHere\\tabby.exe', '/f'])
  assert.deepEqual(args[1], ['add', APP_PATHS_KEY, '/v', APP_PATHS_MARKER_NAME, '/d', APP_PATHS_MARKER_VALUE, '/f'])
})

test('buildContextMenuCommand 使用 %V', () => {
  assert.equal(buildContextMenuCommand('C:\\Apps\\TabbyOpenHere\\tabby.exe'), '"C:\\Apps\\TabbyOpenHere\\tabby.exe" "%V"')
})

test('buildContextMenuRegArgs 生成 4 个根键 × 3 条命令', () => {
  const args = buildContextMenuRegArgs('C:\\L\\tabby.exe', 'C:\\T\\Tabby.exe', '在 Tabby 中打开')
  assert.equal(args.length, CONTEXT_MENU_KEY_ROOTS.length * 3)
  assert.deepEqual(args[0], ['add', CONTEXT_MENU_KEY_ROOTS[0], '/ve', '/d', '在 Tabby 中打开', '/f'])
  assert.deepEqual(args[1], ['add', CONTEXT_MENU_KEY_ROOTS[0], '/v', 'Icon', '/d', '"C:\\T\\Tabby.exe"', '/f'])
  assert.deepEqual(args[2], ['add', CONTEXT_MENU_KEY_ROOTS[0] + '\\command', '/ve', '/d', '"C:\\L\\tabby.exe" "%V"', '/f'])
})

test('parsePendingRequest 接受有效请求并拒绝过期/畸形请求', () => {
  const now = 100000
  const valid = JSON.stringify({ path: 'C:\\work', ts: now - 1000, id: 'a' })
  assert.deepEqual(parsePendingRequest(valid, now), { path: 'C:\\work', ts: now - 1000, id: 'a' })

  assert.equal(parsePendingRequest(JSON.stringify({ path: 'C:\\work', ts: now - 20000, id: 'a' }), now), null)
  assert.equal(parsePendingRequest(JSON.stringify({ path: '', ts: now, id: 'a' }), now), null)
  assert.equal(parsePendingRequest(JSON.stringify({ path: 'C:\\work', ts: now + 120000, id: 'a' }), now), null)
  assert.equal(parsePendingRequest('not json', now), null)
  assert.equal(parsePendingRequest(null, now), null)

  const atTtl = JSON.stringify({ path: 'C:\\work', ts: now - 10000, id: 'a' })
  assert.ok(parsePendingRequest(atTtl, now))
})

test('getSelectableProfiles 只保留无 fsBase 的本地 Profile', () => {
  const profiles = [
    { id: 'local:cmd', name: 'CMD', type: 'local', isBuiltin: true, options: {} },
    { id: 'local:powershell', name: 'PowerShell', type: 'local', isBuiltin: true, options: {} },
    { id: 'local:wsl', name: 'WSL', type: 'local', isBuiltin: true, options: { fsBase: '\\\\wsl$\\Ubuntu' } },
    { id: 'ssh:1', name: 'Server', type: 'ssh', options: {} },
    { id: 'local:custom', name: 'Git Bash', type: 'local', options: {} },
  ]
  assert.deepEqual(getSelectableProfiles(profiles).map(p => p.id), ['local:cmd', 'local:powershell', 'local:custom'])
})

test('resolveDefaultProfile 优先配置 id，再内置，再第一个', () => {
  const profiles = [
    { id: 'local:cmd', name: 'CMD', type: 'local', isBuiltin: true, options: {} },
    { id: 'local:powershell', name: 'PowerShell', type: 'local', isBuiltin: true, options: {} },
    { id: 'local:custom', name: 'Custom', type: 'local', options: {} },
  ]
  assert.equal(resolveDefaultProfile(profiles, 'local:powershell')?.id, 'local:powershell')
  assert.equal(resolveDefaultProfile(profiles, 'missing')?.id, 'local:cmd')
  assert.equal(resolveDefaultProfile([profiles[2]], 'missing')?.id, 'local:custom')
  assert.equal(resolveDefaultProfile([], 'missing'), null)
})

test('findProfileById 不返回 WSL 或 SSH', () => {
  const profiles = [
    { id: 'local:cmd', type: 'local', options: {} },
    { id: 'local:wsl', type: 'local', options: { fsBase: '\\\\wsl$\\Ubuntu' } },
    { id: 'ssh:1', type: 'ssh', options: {} },
  ]
  assert.equal(findProfileById(profiles, 'local:cmd')?.id, 'local:cmd')
  assert.equal(findProfileById(profiles, 'local:wsl'), null)
  assert.equal(findProfileById(profiles, 'ssh:1'), null)
})
