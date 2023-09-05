// import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, getSize, setSidebarStatus, setLanguage, setSize } from '@/utils/cookies'
// import { getLocale } from '@/lang'
// import store from '@/store'
import { defineStore } from 'pinia'

export enum DeviceType {
  Mobile,
  Desktop
}

export type SizeType = '' | 'default' | 'small' | 'large'

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
  size: SizeType
}

export const useAppStore = defineStore('appStore', {
  state: (): IAppState => ({
    device: DeviceType.Desktop,
    sidebar: {
      opened: getSidebarStatus() !== 'closed',
      withoutAnimation: false
    },
    size: (getSize() || 'medium') as SizeType,
    language: 'en'
  }),
  getters: {
    getDevice: (state) => state.device,
    getSize: (state) => state.size,
    getLanguage: (state) => state.language,
    getSidebar: (state) => state.sidebar
  },
  actions: {
    toggleDevice(newDevice: DeviceType) {
      this.device = newDevice
    },
    closeSideBar(withoutAnimation: boolean) {
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
      setSidebarStatus('closed')
    },
    toggleSidebar(withoutAnimation: boolean) {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = withoutAnimation
      setSidebarStatus(this.sidebar.opened ? 'opened' : 'closed')
    },
    setLanguage(lang: string) {
      this.language = lang
      setLanguage(this.language)
    },
    setSize(size: SizeType) {
      this.size = size
      setSize(this.size)
    }
  }
})
