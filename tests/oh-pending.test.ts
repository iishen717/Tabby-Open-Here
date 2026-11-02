import { test } from 'node:test'
import assert from 'node:assert/strict'

const store = new Map<string, string>()
;(globalThis as any).localStorage = {
  getItem: (key: string) => store.has(key) ? store.get(key)! : null,
  setItem: (key: string, value: string) => { store.set(key, String(value)) },
  removeItem: (key: string) => { store.delete(key) },
}

import { createPendingOpen, consumePendingOpen } from '../src/oh-pending'

test('createPendingOpen / consumePendingOpen 往返一次', () => {
  store.clear()
  createPendingOpen('C:\\work')
  const request = consumePendingOpen()
  assert.equal(request?.path, 'C:\\work')
  assert.equal(consumePendingOpen(), null)
})

test('consumePendingOpen 丢弃过期请求', () => {
  store.clear()
  store.set('oh-pending-open', JSON.stringify({ path: 'C:\\work', ts: Date.now() - 20000, id: 'x' }))
  assert.equal(consumePendingOpen(), null)
})
