/**
 * 新窗口启动引导
 * 在 AppService.ready$ 时消费一次性请求，在新窗口中打开目标目录
 */
import { Injectable } from '@angular/core'
import * as fs from 'fs'
import { AppService, NotificationsService } from 'tabby-core'
import { consumePendingOpen } from './oh-pending'
import { getProfileSelection } from './oh-settings'
import { t } from './oh-i18n'
import { OpenHereOpenerService } from './oh-opener'

@Injectable()
export class OpenHereBootService {
  constructor(
    private app: AppService,
    private opener: OpenHereOpenerService,
    private notifications: NotificationsService,
  ) {
    if (this.app.ready$ && typeof this.app.ready$.subscribe === 'function') {
      this.app.ready$.subscribe(() => {
        void this.processPending()
      })
    } else {
      setTimeout(() => {
        void this.processPending()
      }, 1500)
    }
  }

  private async processPending(): Promise<void> {
    const request = consumePendingOpen()
    if (!request) return
    try {
      if (!fs.statSync(request.path).isDirectory()) return
      const ok = await this.opener.openAt(request.path, getProfileSelection())
      if (!ok) {
        this.notifications.error('Open Here', t(
          '未能在新窗口中打开目录。',
          'Could not open the directory in the new window.'
        ))
      }
    } catch {
      this.notifications.error('Open Here', t(
        '未能在新窗口中打开目录。',
        'Could not open the directory in the new window.'
      ))
    }
  }
}
