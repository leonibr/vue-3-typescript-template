<template>
  <vue-dropzone
    :id="id"
    :options="dropzoneOptions"
    :use-custom-slot="true"
    @vdropzone-removed-file="dropzoneRemovedFile"
    @vdropzone-success="dropzoneSuccess"
  >
    <div class="dropzone-custom-content">
      <h3 class="dropzone-custom-title" :style="{ color: themeColor }">
        Drag and drop to upload content!
      </h3>
      <div class="subtitle">...or click to select a file from your computer</div>
    </div>
  </vue-dropzone>
</template>

<script lang="ts">
import VueDropzone from 'vue2-dropzone-vue3'
import { defineComponent } from 'vue'
import { useSettingsStore } from '@/stores/settings-store'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Dropzone',
  components: {
    VueDropzone
  },
  props: {
    // You can add more Prop, see: https://www.dropzonejs.com/#configuration
    id: { type: String, required: true },
    url: { type: String, required: true },
    thumbnailHeight: { type: Number, default: 200 },
    thumbnailWidth: { type: Number, default: 200 },
    maxFiles: { type: Number, default: 4 },
    maxFilesize: { type: Number, default: 5 }, // in MB
    autoProcessQueue: { type: Boolean, default: true },
    addRemoveLinks: { type: Boolean, default: true },
    dictDefaultMessage: { type: String, default: 'Drop files here to upload' },
    dictFallbackMessage: { type: String, default: 'Your broswer does not support dropzone.js' },
    dictRemoveFile: { type: String, default: 'Remove' },
    dictMaxFilesExceeded: { type: String, default: 'Max Files Exceeded' }
  },
  setup() {
    const settingStore = useSettingsStore()
    return {
      settingStore
    }
  },
  computed: {
    dropzoneOptions() {
      return {
        url: this.url,
        thumbnailWidth: this.thumbnailWidth,
        thumbnailHeight: this.thumbnailHeight,
        maxFiles: this.maxFiles,
        maxFilesize: this.maxFilesize,
        autoProcessQueue: this.autoProcessQueue,
        addRemoveLinks: this.addRemoveLinks,
        dictDefaultMessage: this.dictDefaultMessage,
        dictFallbackMessage: this.dictFallbackMessage,
        dictRemoveFile: this.dictRemoveFile,
        dictMaxFilesExceeded: this.dictMaxFilesExceeded
      }
    },
    themeColor() {
      return this.settingStore.theme
    }
  },
  methods: {
    // You can add more Event handler, see: https://rowanwins.github.io/vue-dropzone/docs/dist/#/events
    dropzoneSuccess(file: File, response: any) {
      this.$emit('dropzone-success', file, response)
    },

    dropzoneRemovedFile(file: File, error: Error, xhr: XMLHttpRequest) {
      this.$emit('dropzone-removed-file', file, error, xhr)
    }
  }
})
</script>

<style lang="scss" scoped>
.dropzone-custom-content {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.subtitle {
  color: #314b5f;
}

.dropzone {
  min-height: 250px;
}
</style>
