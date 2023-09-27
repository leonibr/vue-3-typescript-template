<template>
  <div class="components-container">
    <aside>
      This is based on
      <a class="link-type" href="//github.com/dai-siki/vue-image-crop-upload">
        vue-image-crop-upload
      </a>
    </aside>
    <pan-thumb :image="image" />
    <el-button
      type="primary"
      :icon="Upload"
      tyle="position: absolute;bottom: 15px;margin-left: 40px;"
      @click="toggleShow"
    >
      Change Avatar
    </el-button>
    <avatar-upload
      v-model="showImageUpload"
      :value="false"
      field="avatar"
      :width="300"
      :height="300"
      :params="params"
      :headers="headers"
      url="https://httpbin.org/post"
      @close="onClose"
      @crop-upload-success="onCropUploadSuccess"
    />
  </div>
</template>

<script lang="ts">
import AvatarUpload from '@/components/AvatarUpload/index.vue'
import PanThumb from '@/components/PanThumb/index.vue'
import { defineComponent, ref, reactive } from 'vue'
import { Upload } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'AvatarUploadDemo',
  components: {
    AvatarUpload,
    PanThumb
  },
  setup() {
    const showImageUpload = ref(false)
    const image = ref('https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191')
    const params = reactive({ someParams: 'your_params_goes_here' })
    const headers = reactive({ smail: '*_~' })
    return {
      showImageUpload,
      image,
      params,
      headers,
      Upload
    }
  },
  methods: {
    toggleShow() {
      this.showImageUpload = !this.showImageUpload
    },

    onCropUploadSuccess(jsonData: any, field: string) {
      this.showImageUpload = false
      this.image = jsonData.files[field]
    },

    onClose() {
      this.showImageUpload = false
    }
  }
})
</script>

<style lang="scss" scoped>
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
</style>
