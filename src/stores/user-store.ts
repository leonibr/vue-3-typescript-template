// import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/users'
import { getToken, removeToken, setToken } from '@/utils/cookies'
import { defineStore } from 'pinia'
// import { getToken, setToken, removeToken } from '@/utils/cookies'
// import router, { resetRouter } from '@/router'
// import { PermissionModule } from './permission'
// import { TagsViewModule } from './tags-view'
import router, { resetRouter } from '@/router/index'
import { usePermissionStore } from './permission'
import { useTagsViewStore } from './tags-view-store'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string
}

export const useUserStore = defineStore('UserStore', {
  state(): IUserState {
    return {
      token: getToken() || '',
      name: '',
      avatar: '',
      introduction: '',
      roles: [] as string[],
      email: ''
    }
  },
  getters: {
    getPermissionStore: () => usePermissionStore(),
    getTagsViewStore: () => useTagsViewStore()
  },
  actions: {
    SET_TOKEN(token: string) {
      this.token = token
    },

    SET_NAME(name: string) {
      this.name = name
    },

    SET_AVATAR(avatar: string) {
      this.avatar = avatar
    },
    SET_INTRODUCTION(introduction: string) {
      this.introduction = introduction
    },

    SET_ROLES(roles: string[]) {
      this.roles = roles
    },

    SET_EMAIL(email: string) {
      this.email = email
    },

    async Login(userInfo: { username: string; password: string }) {
      let { username } = userInfo
      const { password } = userInfo
      username = username.trim()
      const { data } = await login({ username, password })
      setToken(data.accessToken)
      this.SET_TOKEN(data.accessToken)
    },

    resetToken() {
      removeToken()
      this.SET_TOKEN('')
      this.SET_ROLES([])
    },

    async GetUserInfo() {
      if (this.token === '') {
        throw Error('GetUserInfo: token is undefined!')
      }
      const { data } = await getUserInfo({
        /* Your params here */
      })
      if (!data) {
        throw Error('Verification failed, please Login again.')
      }
      const { roles, name, avatar, introduction, email } = data.user
        // roles must be a non-empty array
      if (!roles || roles.length <= 0) {
        throw Error('GetUserInfo: roles must be a non-null array!')
      }
      this.SET_ROLES(roles)
      this.SET_NAME(name)
      this.SET_AVATAR(avatar)
      this.SET_INTRODUCTION(introduction)
      this.SET_EMAIL(email)
    },

    async ChangeRoles(role: string) {
      // Dynamically modify permissions
      const token = role + '-token'
      this.SET_TOKEN(token)
      setToken(token)
      await this.GetUserInfo()
      resetRouter()
      // Generate dynamic accessible routes based on roles
      this.getPermissionStore.generateRoutes(this.roles)
      // Add generated routes
      this.getPermissionStore.dynamicRoutes.forEach((route) => {
        router.addRoute(route)
      })
      // Reset visited views and cached views
      this.getTagsViewStore.delAllViews()
    },

    async LogOut() {
      if (this.token === '') {
        throw Error('LogOut: token is undefined!')
      }
      await logout()
      removeToken()
      resetRouter()

      // Reset visited views and cached views
      this.getTagsViewStore.delAllViews()
      this.SET_TOKEN('')
      this.SET_ROLES([])
    }
  }
})
