/**
 * Tabby 模块类型声明（shim）
 * 为 tabby-core、tabby-settings、tabby-terminal 提供最小类型声明
 */
declare module 'tabby-core' {
  const TabbyCoreModule: any
  export default TabbyCoreModule

  export interface CLIEvent {
    argv: {
      _: string[]
      directory?: string
      [key: string]: any
    }
    cwd: string
    secondInstance: boolean
  }

  export abstract class CLIHandler {
    priority: number
    firstMatchOnly: boolean
    abstract handle(event: CLIEvent): Promise<boolean>
  }

  export class AppService {
    activeTab: any
    ready$: any
    openNewTab(options: any): any
    closeTab(tab: any): void
  }

  export class ProfilesService {
    getProfiles(options?: any): Promise<any[]>
    getConfigProxyForProfile(profile: any): any
    openNewTabForProfile(profile: any): Promise<any>
  }

  export class ConfigService {
    store: any
    get(): any
  }

  export class HostAppService {
    newWindow(): void
  }

  export class HostWindowService {
    bringToFront(): void
  }

  export class NotificationsService {
    error(title: string, message: string): void
    notice(title: string, message?: string): void
  }

  export class LogService {
    create(name: string): any
  }

  export interface ToolbarButton {
    icon?: string
    title: string
    weight?: number
    click?: () => void
    showInStartPage?: boolean
    showInToolbar?: boolean
  }

  export abstract class ToolbarButtonProvider {
    abstract provide(): ToolbarButton[]
  }
}

declare module 'tabby-settings' {
  export abstract class SettingsTabProvider {
    getComponentType?(): any
    abstract getSettingsTabs(): Promise<Array<{
      title: string
      icon?: string
      weight?: number
      component: any
    }>>
  }
}

declare module 'tabby-terminal' {
  export class TerminalDecorator {
    attach(terminal: any): void
    subscribeUntilDetached(terminal: any, sub: any): void
  }
  export class BaseTerminalTabComponent {
    element?: any
    sshSession?: any
    profile?: any
    customTitle?: string
    title?: string
  }
}
