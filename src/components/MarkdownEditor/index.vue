<template>
  <div :id="id" />
</template>

<script lang="ts">
import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import '@toast-ui/editor/dist/i18n/es-es'
import '@toast-ui/editor/dist/i18n/it-it'
import '@toast-ui/editor/dist/i18n/ja-jp'
import '@toast-ui/editor/dist/i18n/ko-kr'
import '@toast-ui/editor/dist/i18n/zh-cn'
import Editor, { EditorOptions } from '@toast-ui/editor'
import defaultOptions from './default-options'
import { defineComponent, type PropType, reactive, watch } from 'vue'

const defaultId = () => 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')

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
    const markdownEditor: Editor = reactive({})
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
      this.markdownEditor = undefined
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
    initEditor() {
      const editorElement = document.getElementById(this.id)
      if (!editorElement) return
      // eslint-disable-next-line new-cap
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
