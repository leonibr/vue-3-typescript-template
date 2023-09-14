<template>
  <div class="upload-container">
    <el-button
      :style="{ background: color, borderColor: color }"
      :icon="Upload"
      type="primary"
      @click="dialogVisible = true"
    >
      upload
    </el-button>
    <el-dialog v-model="dialogVisible" :modal-append-to-body="false">
      <el-upload
        :multiple="true"
        :file-list="defaultFileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        list-type="picture-card"
      >
        <el-button size="small" type="primary"> Click upload </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false"> Cancel </el-button>
      <el-button type="primary" @click="handleSubmit"> Confirm </el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import type { UploadRawFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

export interface IUploadObject {
  hasSuccess: boolean
  uid: number
  url: string
  width: number
  height: number
}

export default defineComponent({
  name: 'EditorImageUpload',
  props: {
    color: {
      type: String,
      required: true
    }
  },
  setup() {
    const dialogVisible = ref(false)
    const listObj = reactive<{ [key: string]: IUploadObject }>({})
    const defaultFileList = reactive([])
    return {
      dialogVisible,
      listObj,
      defaultFileList,
      Upload
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every((item) => this.listObj[item].hasSuccess)
    },

    handleSubmit() {
      const arr = Object.keys(this.listObj).map((v) => this.listObj[v])
      if (!this.checkAllSuccess()) {
        ElMessage(
          'Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!'
        )
        return
      }
      this.$emit('success-callback', arr)
      this.listObj = {}
      this.defaultFileList = []
      this.dialogVisible = false
    },

    handleSuccess(response: any, file: UploadRawFile) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },

    handleRemove(file: UploadRawFile) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },

    beforeUpload(file: UploadRawFile) {
      const fileName = file.uid
      const img = new Image()
      img.src = window.URL.createObjectURL(file)
      img.onload = () => {
        this.listObj[fileName] = {
          hasSuccess: false,
          uid: file.uid,
          url: '',
          width: img.width,
          height: img.height
        }
      }
    }
  }
})
</script>

<style lang="scss">
.editor-slide-upload {
  .el-upload--picture-card {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
}
</style>
