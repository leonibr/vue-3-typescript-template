<template>
  <div :id="id" />
</template>

<script lang="ts">
import type { EditorOptions } from '@toast-ui/editor'
import defaultOptions from './default-options'
import { defineComponent, type PropType, reactive, ref, watch } from 'vue'

type EditorModule = typeof import('@toast-ui/editor')
type EditorConstructor = EditorModule['default']
type EditorInstance = InstanceType<EditorConstructor>

const defaultId = () => 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')

const languageLoaders: Record<string, (() => Promise<unknown>) | undefined> = {
  es: () => import('@toast-ui/editor/dist/i18n/es-es'),
  it: () => import('@toast-ui/editor/dist/i18n/it-it'),
  ja: () => import('@toast-ui/editor/dist/i18n/ja-jp'),
  ko: () => import('@toast-ui/editor/dist/i18n/ko-kr'),
  zh: () => import('@toast-ui/editor/dist/i18n/zh-cn')
}

let editorStylesPromise: Promise<void> | null = null
let editorPromise: Promise<EditorConstructor> | null = null

function loadEditorStyles() {
  if (!editorStylesPromise) {
    editorStylesPromise = Promise.all([
      import('codemirror/lib/codemirror.css'),
      import('@toast-ui/editor/dist/toastui-editor.css')
    ]).then(() => undefined)
  }

  return editorStylesPromise
}

function loadEditorRuntime() {
  if (!editorPromise) {
    editorPromise = import('@toast-ui/editor').then((module) => module.default)
  }

  return editorPromise
}

async function loadEditor(language: string) {
  const runtimePromise = loadEditorRuntime()
  const languageLoader = languageLoaders[language]

  await Promise.all([
    loadEditorStyles(),
    runtimePromise,
    languageLoader ? languageLoader() : Promise.resolve()
  ])

  return runtimePromise
}

export default defineComponent({
  name: 'MarkdownEditor',
  props: {
    initialValue: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: defaultId
    },
    options: {
      type: Object as PropType<EditorOptions>,
      default: () => defaultOptions
    },
    mode: {
      type: String,
      default: 'markdown'
    },
    height: {
      type: String,
      default: '300px'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  setup() {
    const markdownEditor = ref<EditorInstance | null>(null)
    // Mapping for local lang to tuiEditor lang
    // https://github.com/nhn/tui.editor/blob/master/apps/editor/docs/i18n.md#supported-languages
    const languageTypeList = reactive<{ [key: string]: string }>({
      en: 'en',
      zh: 'zh-CN',
      es: 'es',
      ja: 'ja',
      ko: 'ko',
      it: 'it'
    })
    return {
      markdownEditor,
      languageTypeList
    }
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, defaultOptions, this.options)
      options.initialEditType = this.mode
      options.height = this.height
      options.language = this.languageTypeList[this.language]
      return options
    }
  },
  mounted() {
    watch(() => this.language, this.onLanguageChange)
    watch(() => this.height, this.onHeightChange)
    watch(() => this.mode, this.onModeChange)
    this.initEditor()
  },
  beforeUnmount() {
    this.destroyEditor()
  },
  methods: {
    onModeChange(value: string) {
      if (this.markdownEditor) {
        this.markdownEditor.changeMode(value)
      }
    },
    destroyEditor() {
      if (!this.markdownEditor) return
      this.markdownEditor.destroy()
      this.markdownEditor = null
    },
    onLanguageChange() {
      this.destroyEditor()
      this.$nextTick(this.initEditor)
    },
    onHeightChange(value: string) {
      if (this.markdownEditor) {
        this.markdownEditor.height(value)
      }
    },
    async initEditor() {
      const editorElement = document.getElementById(this.id)
      if (!editorElement) return
      const Editor = await loadEditor(this.language)
      if (!document.body.contains(editorElement)) return
      this.markdownEditor = new Editor({
        ...this.editorOptions,
        el: editorElement
      })
      this.markdownEditor.insertText(this.initialValue)
    },
    focus() {
      if (this.markdownEditor) {
        this.markdownEditor.focus()
      }
    },
    setHtml(value: string) {
      if (this.markdownEditor) {
        this.markdownEditor.setHtml(value)
      }
    },
    getHtml() {
      if (this.markdownEditor) {
        return this.markdownEditor.getHtml()
      }
      return ''
    }
  }
})
</script>
