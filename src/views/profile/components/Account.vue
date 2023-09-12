<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="userRef.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="userRef.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit"> Update </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import type { IProfile } from '@/views/profile/model/profile'
import { type PropType, defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Account',
  props: {
    user: {
      type: Object as PropType<IProfile>,
      required: true
    }
  },
  setup(props) {
    const userRef = ref(props.user)
    return {
      userRef
    }
  },
  methods: {
    submit() {
      ElMessage({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
})
</script>
