<template>
  <div>
    <div style="margin-bottom: 15px">{{ $t('permission.roles') }}： {{ roles }}</div>
    {{ $t('permission.switchRoles') }}：
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useUserStore } from '@/stores/user-store'

export default defineComponent({
  name: 'SwitchRoles',
  setup() {
    const userStore = useUserStore()
    const switchRoles = ref(userStore.roles[0] + '')
    return {
      userStore,
      switchRoles
    }
  },
  mounted() {
    watch(() => this.switchRoles, this.onSwitchRoles)
  },
  computed: {
    roles() {
      return this.userStore.roles
    }
  },
  methods: {
    onSwitchRoles(value: string) {
      this.userStore.ChangeRoles(value).then(() => {
        this.$emit('change')
      })
    }
  }
})
</script>
