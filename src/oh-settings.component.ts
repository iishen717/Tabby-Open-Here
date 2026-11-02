/**
 * Open Here 设置页
 * 功能描述：语言、Windows 集成安装/卸载、默认 Shell、打开方式、Tabby 路径
 */
import { Component, Injectable, OnInit } from '@angular/core'
import { ProfilesService } from 'tabby-core'
import { SettingsTabProvider } from 'tabby-settings'
import { effectiveLocale, getSavedLocale, setSavedLocale, t } from './oh-i18n'
import {
  getOpenMode,
  getProfileSelection,
  getTabbyPath,
  setOpenMode,
  setProfileSelection,
  setTabbyPath,
} from './oh-settings'
import { getSelectableProfiles } from './oh-util'
import {
  detectTabbyPath,
  getStatus,
  install,
  IntegrationStatus,
  tabbyPathExists,
  uninstall,
  updateTabbyPath,
} from './oh-win'

@Component({
  selector: 'oh-settings',
  template: `
    <div class="oh-page">
      <h3 class="oh-title">Open Here</h3>
      <p class="oh-desc">{{ t('在资源管理器地址栏输入 tabby，或在文件夹右键菜单中选择「在 Tabby 中打开」。', 'Type tabby in the Explorer address bar, or use "Open in Tabby" in the folder context menu.') }}</p>

      <div class="oh-section">
        <label class="oh-label">{{ t('语言', 'Language') }}</label>
        <select class="oh-select" [(ngModel)]="lang" (ngModelChange)="onLangChange()">
          <option value="">{{ t('自动', 'Auto') }}</option>
          <option value="zh-CN">中文</option>
          <option value="en-US">English</option>
        </select>
      </div>

      <div class="oh-section">
        <label class="oh-label">{{ t('Windows 集成', 'Windows Integration') }}</label>
        <div class="oh-status-row">
          <span class="oh-pill" [ngClass]="statusClass">{{ statusText }}</span>
          <span class="oh-status-detail" *ngIf="status">
            {{ t('地址栏命令', 'Address bar command') }}: <code>tabby</code> ·
            {{ t('右键菜单', 'Context menu') }}: {{ status.contextMenuCount }}/4
          </span>
        </div>
        <p class="oh-hint" *ngIf="status?.appPathOccupied">
          {{ t('地址栏命令 tabby 已被其他程序注册。', 'The tabby command is registered by another program.') }}
        </p>
        <div class="oh-btn-row">
          <button class="oh-btn oh-btn-primary" [disabled]="busy" (click)="installIntegration()">
            {{ busy ? t('处理中...', 'Working...') : (status?.installed ? t('更新集成', 'Update Integration') : (status?.needsRepair ? t('修复集成', 'Repair Integration') : t('安装集成', 'Install Integration'))) }}
          </button>
          <button class="oh-btn oh-btn-danger" [disabled]="busy || !hasIntegration" (click)="uninstallIntegration()">
            {{ t('卸载集成', 'Uninstall Integration') }}
          </button>
        </div>
        <p class="oh-msg" *ngIf="message" [class.oh-msg-error]="!messageOk">{{ message }}</p>
        <p class="oh-hint">{{ t('Windows 11 的右键菜单在「显示更多选项」中。', 'On Windows 11, the context menu is under "Show more options".') }}</p>
      </div>

      <div class="oh-section">
        <label class="oh-label">{{ t('打开方式', 'Open Behavior') }}</label>
        <label class="oh-sub-label">{{ t('默认 Shell', 'Default Shell') }}</label>
        <select class="oh-select" [(ngModel)]="profile" (ngModelChange)="onProfileChange()">
          <option value="default">{{ t('跟随 Tabby 默认', 'Follow Tabby default') }}</option>
          <option *ngFor="let item of profiles" [value]="item.id">{{ item.name }}</option>
        </select>
        <p class="oh-hint">{{ t('WSL Profile 暂不支持（Windows 路径无法可靠映射）。', 'WSL profiles are not listed (Windows paths cannot be mapped reliably).') }}</p>

        <label class="oh-sub-label">{{ t('打开位置', 'Open In') }}</label>
        <div class="oh-radio-row">
          <label class="oh-radio" [class.oh-radio-active]="openMode === 'tab'">
            <input type="radio" name="oh-mode" value="tab" [(ngModel)]="openMode" (ngModelChange)="onModeChange()" />
            <span>{{ t('现有窗口新标签页', 'New tab in current window') }}</span>
          </label>
          <label class="oh-radio" [class.oh-radio-active]="openMode === 'window'">
            <input type="radio" name="oh-mode" value="window" [(ngModel)]="openMode" (ngModelChange)="onModeChange()" />
            <span>{{ t('新窗口', 'New window') }}</span>
          </label>
        </div>
      </div>

      <div class="oh-section">
        <label class="oh-label">{{ t('Tabby 路径', 'Tabby Path') }}</label>
        <div class="oh-path-row">
          <input class="oh-input" type="text" [(ngModel)]="tabbyPath" (change)="onPathCommit()" [placeholder]="t('Tabby.exe 的完整路径', 'Full path to Tabby.exe')" />
          <button class="oh-btn" (click)="browse()">{{ t('浏览', 'Browse') }}</button>
          <button class="oh-btn" (click)="detect()">{{ t('自动检测', 'Detect') }}</button>
        </div>
        <p class="oh-hint oh-hint-error" *ngIf="tabbyPath && !pathValid">
          {{ t('该路径不存在或不是 exe 文件。', 'This path does not exist or is not an exe file.') }}
        </p>
        <p class="oh-hint">{{ t('修改路径后，如已安装集成会自动更新启动器配置。', 'If the integration is installed, changing the path updates the launcher configuration automatically.') }}</p>
      </div>

      <div class="oh-section">
        <label class="oh-label">{{ t('关于', 'About') }}</label>
        <div class="oh-about">
          <span>{{ t('版本', 'Version') }}: {{ version }}</span>
          <span>{{ t('作者', 'Author') }}: iishen717</span>
          <span class="oh-link" (click)="openGithub()">GitHub</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .oh-page { padding: 20px; max-width: 640px; }
    .oh-title { color: var(--primary-color, #3b82f6); font-size: 18px; margin-bottom: 6px; }
    .oh-desc { opacity: .7; font-size: 13px; line-height: 1.6; margin-bottom: 24px; }
    .oh-section { border-top: 1px solid rgba(128,128,128,0.2); padding-top: 16px; margin-bottom: 16px; }
    .oh-label { display: block; font-size: 16px; font-weight: 600; margin-bottom: 10px; }
    .oh-sub-label { display: block; font-size: 13px; font-weight: 500; margin: 10px 0 6px; }
    .oh-select, .oh-input {
      width: 100%; max-width: 420px; padding: 7px 10px; border-radius: 6px;
      background: rgba(128,128,128,0.1); border: 1px solid rgba(128,128,128,0.25);
      font-size: 13px; outline: none; color: inherit; box-sizing: border-box;
    }
    .oh-select { cursor: pointer; }
    .oh-select option { color: #000; background: #fff; }
    .oh-select:focus, .oh-input:focus { border-color: var(--primary-color, #3b82f6); }
    .oh-status-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
    .oh-pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .oh-pill-ok { background: rgba(52,211,153,.15); color: #10b981; }
    .oh-pill-warn { background: rgba(251,146,60,.15); color: #f59e0b; }
    .oh-pill-neutral { background: rgba(128,128,128,.15); color: inherit; opacity: .8; }
    .oh-status-detail { font-size: 12px; opacity: .7; }
    .oh-status-detail code { font-family: monospace; font-size: 12px; }
    .oh-btn-row, .oh-path-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .oh-path-row .oh-input { flex: 1; min-width: 220px; }
    .oh-btn {
      display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
      border-radius: 8px; border: 1px solid rgba(128,128,128,0.25);
      background: rgba(128,128,128,0.08); font-size: 13px; cursor: pointer;
      transition: background .15s; color: inherit; white-space: nowrap;
    }
    .oh-btn:hover:not(:disabled) { background: rgba(128,128,128,0.15); }
    .oh-btn:disabled { opacity: .5; cursor: default; }
    .oh-btn-primary { border-color: var(--primary-color, #3b82f6); color: var(--primary-color, #3b82f6); }
    .oh-btn-danger { border-color: #e24b4a; color: #e24b4a; }
    .oh-hint { font-size: 12px; opacity: .65; line-height: 1.5; margin: 8px 0 0; }
    .oh-hint-error { color: #e24b4a; opacity: 1; }
    .oh-msg { margin: 10px 0 0; font-size: 12px; color: #10b981; line-height: 1.5; }
    .oh-msg-error { color: #e24b4a; }
    .oh-radio-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
    .oh-radio {
      display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
      border-radius: 6px; border: 1px solid rgba(128,128,128,0.25);
      cursor: pointer; transition: all .15s; user-select: none; font-size: 13px;
    }
    .oh-radio:hover { border-color: var(--primary-color, #3b82f6); }
    .oh-radio-active { border-color: var(--primary-color, #3b82f6); background: rgba(59,130,246,.08); }
    .oh-radio input { margin: 0; }
    .oh-about { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; opacity: .8; }
    .oh-link { color: var(--primary-color, #3b82f6); cursor: pointer; }
    .oh-link:hover { text-decoration: underline; }
  `],
})
export class OpenHereSettingsComponent implements OnInit {
  lang: '' | 'zh-CN' | 'en-US' = getSavedLocale()
  tabbyPath = getTabbyPath()
  profile = getProfileSelection()
  openMode = getOpenMode()
  profiles: any[] = []
  status: IntegrationStatus | null = null
  busy = false
  message = ''
  messageOk = true
  readonly version = '1.0.0'

  constructor(private profilesService: ProfilesService) {}

  async ngOnInit(): Promise<void> {
    await this.reloadProfiles()
    await this.refreshStatus()
    if (!this.tabbyPath) {
      await this.detect()
    }
  }

  t(zh: string, en: string): string {
    return effectiveLocale() === 'en-US' ? en : zh
  }

  get pathValid(): boolean {
    return tabbyPathExists(this.tabbyPath)
  }

  get statusText(): string {
    if (!this.status) return this.t('检查中...', 'Checking...')
    if (this.status.installed) return this.t('已安装', 'Installed')
    if (this.status.appPathOccupied) return this.t('地址栏命令被占用', 'Address bar command in use')
    if (this.status.needsRepair) return this.t('需修复', 'Needs repair')
    return this.t('未安装', 'Not installed')
  }

  get statusClass(): string {
    if (!this.status) return 'oh-pill-neutral'
    if (this.status.installed) return 'oh-pill-ok'
    if (this.status.appPathOccupied || this.status.needsRepair) return 'oh-pill-warn'
    return 'oh-pill-neutral'
  }

  get hasIntegration(): boolean {
    return !!this.status && (
      this.status.launcherExists ||
      this.status.contextMenuCount > 0 ||
      (this.status.appPathExists && !this.status.appPathOccupied)
    )
  }

  async reloadProfiles(): Promise<void> {
    try {
      this.profiles = getSelectableProfiles(await this.profilesService.getProfiles())
    } catch {
      this.profiles = []
    }
    if (this.profile !== 'default' && !this.profiles.find(item => item.id === this.profile)) {
      this.profile = 'default'
      setProfileSelection('default')
    }
  }

  async refreshStatus(): Promise<void> {
    try {
      this.status = await getStatus()
    } catch {
      this.status = null
    }
  }

  onLangChange(): void {
    setSavedLocale(this.lang)
    this.message = ''
  }

  onProfileChange(): void {
    setProfileSelection(this.profile)
  }

  onModeChange(): void {
    setOpenMode(this.openMode)
  }

  onPathCommit(): void {
    setTabbyPath(this.tabbyPath)
    if (!this.status?.installed || !this.pathValid) return
    updateTabbyPath(this.tabbyPath)
      .then(() => this.refreshStatus())
      .then(() => this.setMessage(this.t('Tabby 路径已更新。', 'Tabby path updated.'), true))
      .catch(error => this.setMessage(this.errorText(error), false))
  }

  async detect(): Promise<void> {
    try {
      const detected = await detectTabbyPath()
      if (!detected) {
        this.setMessage(this.t('未检测到 Tabby.exe，请手动选择。', 'Tabby.exe was not detected; choose it manually.'), false)
        return
      }
      this.tabbyPath = detected
      setTabbyPath(detected)
      if (this.status?.installed) {
        await updateTabbyPath(detected)
        await this.refreshStatus()
      }
      this.setMessage(this.t('已检测到 Tabby 路径。', 'Tabby path detected.'), true)
    } catch (error) {
      this.setMessage(this.errorText(error), false)
    }
  }

  async browse(): Promise<void> {
    try {
      const remote = (window as any).require('@electron/remote')
      const result = await remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Tabby', extensions: ['exe'] }],
      })
      if (!result.canceled && result.filePaths && result.filePaths[0]) {
        this.tabbyPath = result.filePaths[0]
        this.onPathCommit()
      }
    } catch {
      this.setMessage(this.t('当前环境无法打开文件选择器，请手动输入路径。', 'File picker unavailable; enter the path manually.'), false)
    }
  }

  async installIntegration(): Promise<void> {
    if (this.busy) return
    const path = (this.tabbyPath || '').trim()
    if (!tabbyPathExists(path)) {
      this.setMessage(this.t('请先选择有效的 Tabby.exe 路径。', 'Please choose a valid Tabby.exe path.'), false)
      return
    }
    await this.refreshStatus()
    if (this.status?.appPathOccupied) {
      const ok = confirm(this.t(
        '地址栏命令 tabby 已被其他程序注册，继续安装会覆盖它。是否继续？',
        'The tabby command is registered by another program. Continue and overwrite it?'
      ))
      if (!ok) return
    }
    this.busy = true
    this.message = ''
    try {
      setTabbyPath(path)
      await install({
        tabbyPath: path,
        contextLabel: this.t('在 Tabby 中打开', 'Open in Tabby'),
      })
      await this.refreshStatus()
      this.setMessage(this.t('Windows 集成已安装。', 'Windows integration installed.'), true)
    } catch (error) {
      this.setMessage(this.errorText(error), false)
    } finally {
      this.busy = false
    }
  }

  async uninstallIntegration(): Promise<void> {
    if (this.busy) return
    const ok = confirm(this.t(
      '确定卸载 Windows 集成吗？将删除地址栏命令和右键菜单。',
      'Uninstall the Windows integration? This removes the address bar command and context menu.'
    ))
    if (!ok) return
    this.busy = true
    this.message = ''
    try {
      await uninstall()
      await this.refreshStatus()
      this.setMessage(this.t('Windows 集成已卸载。', 'Windows integration uninstalled.'), true)
    } catch (error) {
      this.setMessage(this.errorText(error), false)
    } finally {
      this.busy = false
    }
  }

  openGithub(): void {
    const url = 'https://github.com/iishen717/Tabby-Open-Here'
    try {
      (window as any).require('electron').shell.openExternal(url)
    } catch {
      try { window.open(url, '_blank') } catch { location.href = url }
    }
  }

  private setMessage(text: string, ok: boolean): void {
    this.message = text
    this.messageOk = ok
  }

  private errorText(error: any): string {
    return String((error && error.message) || error || this.t('未知错误', 'Unknown error'))
  }
}

@Injectable()
export class OpenHereSettingsTabProvider extends SettingsTabProvider {
  id = 'oh-settings'
  icon = 'fas fa-folder-open'
  title = 'Open Here'

  getComponentType(): any {
    return OpenHereSettingsComponent
  }

  async getSettingsTabs() {
    return [{
      title: 'Open Here',
      icon: 'fas fa-folder-open',
      weight: 97,
      component: OpenHereSettingsComponent,
    }]
  }
}
