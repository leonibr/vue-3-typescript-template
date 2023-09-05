<script setup lang="ts">
import { defineComponent } from 'vue'
import HamburgerIcon from '@/components/icons/IconHamburger.vue'
</script>

<template>
  <div :class="[{ 'is-active': isActive }]" @click="toggleClick">
    <hamburger-icon />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'HamburgerComponent',
  props: {
    isActive: Boolean
  },
  emits: ['toggle-click'],
  methods: {
    toggleClick() {
      this.$emit('toggle-click')
    }
  }
})
</script>

<style lang="scss" scoped>
.is-active {
  transform: rotate(180deg);
}
</style>
