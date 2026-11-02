/**
 * 按 Profile + 目录打开 Tabby 标签页
 */
import { Injectable } from '@angular/core'
import { ConfigService, HostWindowService, ProfilesService } from 'tabby-core'
import { getSelectableProfiles, resolveDefaultProfile } from './oh-util'

@Injectable()
export class OpenHereOpenerService {
  constructor(
    private profiles: ProfilesService,
    private config: ConfigService,
    private hostWindow: HostWindowService,
  ) {}

  async resolveProfile(selected: string): Promise<any | null> {
    const all = await this.profiles.getProfiles()
    const selectable = getSelectableProfiles(all)
    if (selected && selected !== 'default') {
      return selectable.find(profile => profile.id === selected) || null
    }
    return resolveDefaultProfile(all, this.config.store?.terminal?.profile)
  }

  async openAt(directory: string, selected: string): Promise<boolean> {
    const profile = await this.resolveProfile(selected)
    if (!profile) return false

    const full = this.profiles.getConfigProxyForProfile(profile)
    const withCwd = {
      ...full,
      options: {
        ...(full.options || {}),
        cwd: directory,
      },
    }
    await this.profiles.openNewTabForProfile(withCwd)
    this.hostWindow.bringToFront()
    return true
  }
}
