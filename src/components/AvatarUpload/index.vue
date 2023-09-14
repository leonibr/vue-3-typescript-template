<template>
  <image-crop-upload
    ref="uploader"
    v-model="show"
    :field="field"
    :url="url"
    :width="width"
    :height="height"
    :params="params"
    :headers="headers"
    :lang-type="language"
    :with-credentials="true"
    img-format="png"
    @src-file-set="srcFileSet"
    @crop-success="cropSuccess"
    @crop-upload-success="cropUploadSuccess"
    @crop-upload-fail="cropUploadFail"
  />
</template>

<script lang="ts">
import ImageCropUpload from 'vue-image-crop-upload'
import { defineComponent, reactive, ref, watch, nextTick } from 'vue'
import { useAppStore } from '@/stores/app-store'

export default defineComponent({
  name: 'AvatarUpload',
  components: {
    ImageCropUpload
  },
  props: {
    // You can add more Prop, see: https://github.com/dai-siki/vue-image-crop-upload#usage
    value: {
      type: Boolean,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    params: {
      type: Object,
      default: () => null
    },
    headers: {
      type: Object,
      default: () => null
    }
  },
  setup(props) {
    const languageTypeList: { [key: string]: string } = reactive({
      en: 'en',
      zh: 'zh',
      es: 'es-MX',
      ja: 'ja',
      ko: 'ko',
      it: 'it'
    })
    const show = ref<boolean>(props.value)
    const uploader = ref('')
    const appStore = useAppStore()
    return {
      languageTypeList,
      show,
      appStore,
      uploader
    }
  },
  mounted() {
    watch(ref(this.show), (value) => this.emit('input', value))
  },
  computed: {
    language() {
      return this.languageTypeList[this.appStore.language]
    }
  },
  methods: {
    srcFileSet(fileName: string, fileType: string, fileSize: number) {
      this.$emit('src-file-set', fileName, fileType, fileSize)
    },

    cropSuccess(imgDataUrl: string, field: string) {
      this.$emit('crop-success', imgDataUrl, field)
    },

    cropUploadSuccess(jsonData: any, field: string) {
      this.$emit('crop-upload-success', jsonData, field)
      this.$nextTick(() => this.uploader.setStep(1))
    },

    cropUploadFail(status: boolean, field: string) {
      this.$emit('crop-upload-fail', status, field)
    }
  }
})
</script>
