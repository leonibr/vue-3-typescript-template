import defaultSettings from '@/settings'
import { defineStore } from 'pinia'

export interface SettingsState {
  theme: string
  fixedHeader: boolean
  showSettings: boolean
  showTagsView: boolean
  showSidebarLogo: boolean
  sidebarTextTheme: boolean
}

export interface SettingsPayLoad {
  key: string
  value: any
}

export const useSettingsStore = defineStore('settingsStore', {
  state: () =>
    <SettingsState>{
      theme: '#1890ff',
      fixedHeader: defaultSettings.fixedHeader,
      showSettings: defaultSettings.showSettings,
      showTagsView: defaultSettings.showTagsView,
      showSidebarLogo: defaultSettings.showSidebarLogo,
      sidebarTextTheme: defaultSettings.sidebarTextTheme
    },
  actions: {
    CHANGE_SETTING(payload: SettingsPayLoad) {
      const { key, value } = payload
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        ;(this as any)[key] = value
      }
    },
    changeSetting(payload: SettingsPayLoad) {
      this.CHANGE_SETTING(payload)
    }
  }
})
