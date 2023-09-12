<template>
  <a v-if="isExternalFn(to)" :href="to" target="_blank" rel="noopener">
    <slot />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<script lang="ts">
import { isExternal } from '@/utils/validate'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SidebarItemLink',
  props: {
    to: {
      required: true,
      type: String,
      default: ''
    }
  },
  methods: {
    isExternalFn(link: string) {
      return isExternal(link)
    }
  }
})
</script>
