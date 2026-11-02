/**
 * 拦截 Tabby CLI 的 open 命令
 * - 新窗口模式：写入待处理请求并创建新窗口
 * - 新标签页模式：按设置选择 Profile 打开；跟随默认时交还原生逻辑
 */
import { Injectable } from '@angular/core'
import * as fs from 'fs'
import { CLIHandler, CLIEvent, HostAppService, NotificationsService } from 'tabby-core'
import { getOpenMode, getProfileSelection } from './oh-settings'
import { createPendingOpen } from './oh-pending'
import { resolveOpenTarget } from './oh-util'
import { t } from './oh-i18n'
import { OpenHereOpenerService } from './oh-opener'

@Injectable()
export class OpenHereCLIHandler extends CLIHandler {
  priority = 100
  firstMatchOnly = true

  constructor(
    private opener: OpenHereOpenerService,
    private hostApp: HostAppService,
    private notifications: NotificationsService,
  ) {
    super()
  }

  async handle(event: CLIEvent): Promise<boolean> {
    if (!event || !event.argv || event.argv._[0] !== 'open') return false

    let directory: string
    try {
      directory = resolveOpenTarget(event.cwd || process.cwd(), event.argv.directory)
      if (!fs.statSync(directory).isDirectory()) return false
    } catch {
      return false
    }

    if (getOpenMode() === 'window' && event.secondInstance) {
      try {
        createPendingOpen(directory)
        this.hostApp.newWindow()
        return true
      } catch {
        // 回退到当前窗口打开
      }
    }

    const selected = getProfileSelection()
    if (!selected || selected === 'default') return false

    try {
      if (await this.opener.openAt(directory, selected)) {
        return true
      }
    } catch {}

    this.notifications.error('Open Here', t(
      '未能打开所选 Shell 配置，已回退到 Tabby 默认配置。',
      'Could not open the selected shell profile; falling back to Tabby default.'
    ))
    return false
  }
}
