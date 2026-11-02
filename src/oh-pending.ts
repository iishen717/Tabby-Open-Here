/**
 * 新窗口交接请求
 * 写入后由新窗口的 boot service 消费；带 10 秒 TTL
 */
import { PENDING_KEY, PendingOpenRequest, parsePendingRequest } from './oh-util'

export function createPendingOpen(target: string): void {
  const request: PendingOpenRequest = {
    path: target,
    ts: Date.now(),
    id: Math.random().toString(36).slice(2),
  }
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(request))
  } catch {}
}

export function consumePendingOpen(): PendingOpenRequest | null {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(PENDING_KEY)
  } catch {
    return null
  }
  if (!raw) return null
  try {
    localStorage.removeItem(PENDING_KEY)
  } catch {}
  return parsePendingRequest(raw, Date.now())
}
