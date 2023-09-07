<script setup lang="ts">
import { defineComponent } from 'vue'
import svgHambuger from '@/icons/svg/hamburger.svg'
</script>

<template>
  <div :class="[{ 'is-active': isActive }]" @click="toggleClick">
    <icon :data="svgHambuger" original></icon>
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
.svg-icon {
  vertical-align: middle;
}

.is-active {
  transform: rotate(180deg);
}
</style>
