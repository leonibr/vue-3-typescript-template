import { isArray } from '@/utils/validate'
import settings from '@/settings'
import { useErrorLogStore } from '@/stores/error-log-store'

const { errorLog: needErrorLog } = settings

const checkNeed = () => {
  const env = import.meta.env.PROD ? 'production' : 'not-production' // process.env.NODE_ENV

  if (isArray(needErrorLog) && env) {
    return needErrorLog.includes(env)
  }
  return false
}

const globalErrorHandler = () => {
  if (checkNeed()) {
    return (err: any, vm: any, info: string) => {
      console.error({ err, vm, info })
      const errorStore = useErrorLogStore()
      errorStore.AddErrorLog({
        err,
        vm,
        info,
        url: window.location.href
      })
    }
  }
  return undefined
}
export default globalErrorHandler
