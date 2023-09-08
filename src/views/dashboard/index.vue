<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script lang="ts">
import AdminDashboard from './admin/index.vue'
import EditorDashboard from './editor/index.vue'
import { defineComponent, ref } from 'vue'
import { useUserStore } from '@/stores/user-store'

type CurrentRole = 'admin-dashboard' | 'editor-dashboard'

export default defineComponent({
  name: 'DashBoard',
  components: {
    AdminDashboard,
    EditorDashboard
  },
  setup() {
    const currentRole = ref<CurrentRole>('admin-dashboard')
    const userStore = useUserStore()
    return {
      userStore,
      currentRole
    }
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editor-dashboard'
    }
  },
  computed: {
    roles() {
      return this.userStore.roles
    }
  }
})
</script>
