<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
  </div>
</template>

<script lang="ts">
import SwitchRoles from './components/SwitchRoles.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PagePermission',
  components: {
    SwitchRoles
  },
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() }).catch((err) => {
        console.warn(err)
      })
    }
  }
})
</script>
