import { test } from 'node:test'
import assert from 'node:assert/strict'

const store = new Map<string, string>()
;(globalThis as any).localStorage = {
  getItem: (key: string) => store.has(key) ? store.get(key)! : null,
  setItem: (key: string, value: string) => { store.set(key, String(value)) },
  removeItem: (key: string) => { store.delete(key) },
}

import { t, effectiveLocale, setSavedLocale } from '../src/oh-i18n'

test('t 根据保存的语言返回中英文', () => {
  store.clear()
  setSavedLocale('zh-CN')
  assert.equal(effectiveLocale(), 'zh-CN')
  assert.equal(t('中文', 'English'), '中文')
  setSavedLocale('en-US')
  assert.equal(effectiveLocale(), 'en-US')
  assert.equal(t('中文', 'English'), 'English')
})
