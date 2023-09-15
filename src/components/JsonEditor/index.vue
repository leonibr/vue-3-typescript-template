<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script lang="ts">
import CodeMirror, { type Editor } from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
import { defineComponent, ref, reactive, watch } from 'vue'

// HACK: have to use script-loader to load jsonlint
// /* eslint-disable import/no-webpack-loader-syntax */
// require('script-loader!jsonlint')

export default defineComponent({
  name: 'JsonEditor',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  setup() {
    const textarea = ref<InstanceType<typeof HTMLTextAreaElement>>()
    let jsonEditor: Editor = reactive({} as Editor)
    return {
      textarea,
      jsonEditor
    }
  },
  mounted() {
    this.jsonEditor = reactive(
      CodeMirror.fromTextArea(this.textarea as HTMLTextAreaElement, {
        lineNumbers: true,
        mode: 'application/json',
        gutters: ['CodeMirror-lint-markers'],
        theme: 'rubyblue',
        lint: true
      })
    )
    this.jsonEditor.setValue(JSON.stringify(this.modelValue, null, 2))
    this.jsonEditor.on('change', (editor) => {
      this.$emit('changed', editor.getValue())
      this.$emit('update:modelValue', editor.getValue())
    })

    watch(() => this.modelValue, this.onValueChange)
    return {
      jsonEditor: this.jsonEditor
    }
  },
  methods: {
    onValueChange(value: string) {
      if (this.jsonEditor) {
        const editorValue = this.jsonEditor.getValue()
        if (value !== editorValue) {
          this.jsonEditor.setValue(JSON.stringify(this.modelValue, null, 2))
        }
      }
    },
    getValue() {
      if (this.jsonEditor) {
        return this.jsonEditor.getValue()
      }
      return ''
    },
    setValue(value: string) {
      if (this.jsonEditor) {
        this.jsonEditor.setValue(value)
      }
    }
  }
})
</script>

<style lang="scss">
.CodeMirror {
  font-family: Arail, monospace;
  height: auto;
  min-height: 300px;
}

.CodeMirror-scroll {
  min-height: 300px;
}

.cm span.cm-string {
  color: #f08047;
}
</style>

<style lang="scss" scoped>
.json-editor {
  height: 100%;
  position: relative;
}
</style>
