import { defineStore } from 'pinia'

interface IErrorLog {
  err: Error
  vm: any
  info: string
  url: string
}

export interface IErrorLogState {
  logs: IErrorLog[]
}

export const useErrorLogStore = defineStore('errorLogStore', {
  state: () =>
    ({
      logs: []
    }) as IErrorLogState,
  actions: {
    ADD_ERROR_LOG(log: IErrorLog) {
      this.logs.push(log)
    },
    CLEAR_ERROR_LOG() {
      this.logs.splice(0)
    },
    AddErrorLog(log: IErrorLog) {
      this.ADD_ERROR_LOG(log)
    },
    ClearErrorLog() {
      this.CLEAR_ERROR_LOG()
    }
  }
})
