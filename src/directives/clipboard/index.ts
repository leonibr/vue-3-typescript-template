// Inspired by https://github.com/Inndy/vue-clipboard2
import Clipboard from 'clipboard'
import { type Directive } from 'vue'

if (!Clipboard) {
  throw new Error('you should npm install `clipboard` --save at first ')
}

let successCallback: ((clipEvent: Clipboard.Event) => any) | null
let errorCallback: ((clipEvent: Clipboard.Event) => any) | null
let clipboardInstance: Clipboard | null

export const clipboard: Directive<any, any> = {
  beforeMount(el, binding) {
    if (binding.arg === 'success') {
      successCallback = binding.value
    } else if (binding.arg === 'error') {
      errorCallback = binding.value
    } else {
      clipboardInstance = new Clipboard(el, {
        text() {
          return binding.value
        },
        action() {
          return binding.arg === 'cut' ? 'cut' : 'copy'
        }
      })
      clipboardInstance.on('success', (e) => {
        const callback = successCallback
        callback && callback(e)
      })
      clipboardInstance.on('error', (e) => {
        const callback = errorCallback
        callback && callback(e)
      })
    }
  },

  updated(el, binding) {
    if (binding.arg === 'success') {
      successCallback = binding.value
    } else if (binding.arg === 'error') {
      errorCallback = binding.value
    } else {
      clipboardInstance = new Clipboard(el, {
        text() {
          return binding.value
        },
        action() {
          return binding.arg === 'cut' ? 'cut' : 'copy'
        }
      })
    }
  },

  unmounted(_, binding) {
    if (binding.arg === 'success') {
      successCallback = null
    } else if (binding.arg === 'error') {
      errorCallback = null
    } else {
      if (clipboardInstance) {
        clipboardInstance.destroy()
      }
      clipboardInstance = null
    }
  }
}
