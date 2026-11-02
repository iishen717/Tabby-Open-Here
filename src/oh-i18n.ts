/**
 * Open Here 国际化
 * 功能描述：自动检测系统语言 + 中英双语翻译
 */
export type UiLocale = 'zh-CN' | 'en-US'

const LOCALE_KEY = 'oh-locale'

export function getSavedLocale(): '' | UiLocale {
  try {
    const value = localStorage.getItem(LOCALE_KEY)
    if (value === 'zh-CN' || value === 'en-US') return value
  } catch {}
  return ''
}

export function setSavedLocale(value: '' | UiLocale): void {
  try {
    localStorage.setItem(LOCALE_KEY, value || 'auto')
  } catch {}
}

export function detectSystemLocale(): UiLocale {
  try {
    const keys = ['locale', 'language', 'tabby-language', 'tabby-locale',
      'config', 'tabby-config', 'settings', 'tabby-settings', 'tabby-config.json']
    for (const key of keys) {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      if (/^zh/i.test(raw)) return 'zh-CN'
      if (/^en/i.test(raw)) return 'en-US'
      try {
        const obj = JSON.parse(raw)
        const lang = obj?.appearance?.language || obj?.appearance?.locale
          || obj?.language || obj?.locale || obj?.app?.language || obj?.general?.language
        if (lang) return /^zh/i.test(String(lang)) ? 'zh-CN' : 'en-US'
      } catch {}
    }
  } catch {}
  try {
    const langs = navigator.languages || [navigator.language]
    if (langs.find(lang => /^zh/i.test(lang))) return 'zh-CN'
  } catch {}
  try {
    if (/^zh/i.test(navigator.language || '')) return 'zh-CN'
  } catch {}
  return 'en-US'
}

export function effectiveLocale(): UiLocale {
  return getSavedLocale() || detectSystemLocale()
}

export function t(zh: string, en: string): string {
  return effectiveLocale() === 'en-US' ? en : zh
}
