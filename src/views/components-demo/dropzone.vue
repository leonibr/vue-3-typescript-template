<template>
  <div class="components-container">
    <aside>
      Based on
      <a class="link-type" href="https://github.com/rowanwins/vue-dropzone-vue3"
        >vue-dropzone-vue3</a
      >.
    </aside>
    <div class="editor-container">
      <dropzone
        id="myVueDropzone"
        url="https://httpbin.org/post"
        @dropzone-success="dropzoneSuccess"
        @dropzone-removed-file="dropzoneRemovedFile"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Dropzone from '@/components/Dropzone/index.vue'
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'DropzoneDemo',
  components: {
    Dropzone
  },
  methods: {
    dropzoneSuccess(file: File, response: any) {
      ElMessage({ message: 'Upload success', type: 'success' })
      console.log(file, response)
    },

    dropzoneRemovedFile(file: File, error: Error, xhr: XMLHttpRequest) {
      ElMessage({ message: 'Delete success', type: 'success' })
      console.log({ file, error, xhr })
    }
  }
})
</script>
