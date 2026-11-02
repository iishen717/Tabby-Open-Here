import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import { detectTabbyPath, getStatus, getBaseDir, tabbyPathExists } from '../src/oh-win'

test('getBaseDir 指向 LOCALAPPDATA\\TabbyOpenHere', () => {
  assert.ok(getBaseDir().endsWith('TabbyOpenHere'))
})

test('detectTabbyPath 返回存在的文件', async () => {
  const detected = await detectTabbyPath()
  assert.ok(detected)
  assert.ok(fs.existsSync(detected))
})

test('tabbyPathExists 拒绝非 exe', () => {
  assert.equal(tabbyPathExists('C:\\Windows\\notepad.exe'), true)
  assert.equal(tabbyPathExists('C:\\Windows\\notepad.txt'), false)
  assert.equal(tabbyPathExists(''), false)
})

test('getStatus 返回稳定结构', async () => {
  const status = await getStatus()
  assert.equal(typeof status.installed, 'boolean')
  assert.equal(typeof status.needsRepair, 'boolean')
  assert.equal(typeof status.contextMenuCount, 'number')
  assert.ok(status.baseDir.endsWith('TabbyOpenHere'))
})
