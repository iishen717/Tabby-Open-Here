/**
 * Open Here 插件入口
 * 功能描述：注册 CLIHandler（拦截 open）+ 设置页
 */
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgModule, Injector } from '@angular/core'
import TabbyCoreModule, { CLIHandler } from 'tabby-core'
import { SettingsTabProvider } from 'tabby-settings'

import { OpenHereCLIHandler } from './oh-cli-handler'
import { OpenHereBootService } from './oh-boot.service'
import { OpenHereOpenerService } from './oh-opener'
import { OpenHereSettingsComponent, OpenHereSettingsTabProvider } from './oh-settings.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabbyCoreModule,
  ],
  declarations: [
    OpenHereSettingsComponent,
  ],
  providers: [
    OpenHereOpenerService,
    OpenHereBootService,
    { provide: CLIHandler, useClass: OpenHereCLIHandler, multi: true },
    { provide: SettingsTabProvider, useClass: OpenHereSettingsTabProvider, multi: true },
  ],
})
export default class OpenHereModule {
  constructor(injector: Injector) {
    injector.get(OpenHereBootService)
    console.log('[OpenHere] Module loaded OK')
  }
}
