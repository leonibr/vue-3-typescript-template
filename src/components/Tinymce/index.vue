<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <tinymce-editor :id="id" v-model="tinymceContent" :init="{}" />
    <div class="editor-custom-btn-container">
      <editor-image-upload
        :color="uploadButtonColor"
        class="editor-upload-btn"
        @success-callback="imageSuccessCBK"
      />
    </div>
  </div>
</template>

<script lang="ts">
// Docs: https://www.tiny.cloud/docs/advanced/usage-with-module-loaders/
// Import TinyMCE
import 'tinymce/tinymce'
import 'tinymce/models/dom'
// Default icons are required for TinyMCE 5.3 or above
import 'tinymce/icons/default'
// Import themes
import 'tinymce/themes/silver'
// import 'tinymce/themes/mobile'
// Any plugins you want to use has to be imported
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
// import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
// import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
// import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
// import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/quickbars'
// import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
// import 'tinymce/plugins/print'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
// import 'tinymce/plugins/spellchecker'
// import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
// import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
import TinymceEditor from '@tinymce/tinymce-vue' // TinyMCE vue wrapper
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/skins/content/default/content.css'

import EditorImageUpload from './components/EditorImage.vue'
import { plugins, toolbar } from './config'
import { defineComponent, ref, reactive, watch } from 'vue'
import { useAppStore } from '@/stores/app-store'
import { useSettingsStore } from '@/stores/settings-store'
import type { IUploadObject } from './components/EditorImage.vue'

const defaultId = () => 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Tinymce',
  components: {
    EditorImageUpload,
    TinymceEditor
  },
  props: {
    modelValue: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: defaultId
    },
    toolbar: {
      type: Array<string>,
      default: () => []
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [String, Number],
      default: '360px'
    },
    width: {
      type: [String, Number],
      default: 'auto'
    }
  },
  setup() {
    const hasChange = ref(false)
    const hasInit = ref(false)
    const fullscreen = ref(false)
    const appStore = useAppStore()
    const settingsStore = useSettingsStore()
    const tinymceContent = ref('')
    // https://www.tiny.cloud/docs/configure/localization/#language
    // when adding a new language, please also add the corresponding lang file under public/tinymce/langs folder
    const languageTypeList = reactive<{ [key: string]: string }>({
      en: 'en',
      zh: 'zh_CN',
      es: 'es',
      ja: 'ja',
      ko: 'ko_KR',
      it: 'it'
    })

    return {
      hasChange,
      hasInit,
      fullscreen,
      appStore,
      settingsStore,
      languageTypeList,
      tinymceContent
    }
  },
  mounted() {
    watch(
      () => this.tinymceContent,
      (newContent) => this.$emit('update:modelValue', newContent)
    )
    watch(
      () => this.language,
      () => this.onLanguageChange()
    )
  },
  computed: {
    uploadButtonColor() {
      return this.settingsStore.theme
    },
    language() {
      return this.languageTypeList[this.appStore.language]
    },
    containerWidth() {
      const width = this.width
      // Test matches `100`, `'100'`
      if (/^[\d]+(\.[\d]+)?$/.test(width.toString())) {
        return `${width}px`
      }
      return width
    },
    initOptions() {
      return {
        selector: `#${this.id}`,
        height: this.height,
        body_class: 'panel-body',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar[0] : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        language: this.language,
        language_url: this.language === 'en' ? '' : `/tinymce/langs/${this.language}.js`,
        skin: false,
        content_css: false,
        // skin_url: '/tinymce/skins/', // `${import.meta.env.BASE_URL}tinymce/skins/`,
        emoticons_database_url: 'tinymce/emojis.min.js',
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        nonbreaking_force_tab: true,
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false,
        init_instance_callback: (editor: any) => {
          if (this.modelValue) {
            editor.setContent(this.modelValue)
          }
          this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup: (editor: any) => {
          editor.on('FullscreenStateChanged', (e: any) => {
            this.fullscreen = e.state
          })
        }
      }
    }
  },
  methods: {
    imageSuccessCBK(arr: IUploadObject[]) {
      const tinymce = (window as any).tinymce.get(this.id)
      arr.forEach((v) => {
        tinymce.insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    },
    onLanguageChange() {
      const tinymceManager = (window as any).tinymce
      const tinymceInstance = tinymceManager.get(this.id)
      if (this.fullscreen) {
        tinymceInstance.execCommand('mceFullScreen')
      }
      if (tinymceInstance) {
        tinymceInstance.destroy()
      }
      this.$nextTick(() => tinymceManager.init(this.initOptions))
    }
  }
})
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;

  .mce-fullscreen {
    z-index: 10000;
  }
}

.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 6px;
  z-index: 1002;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}

textarea {
  visibility: hidden;
  z-index: -1;
}
</style>
