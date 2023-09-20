<template>
  <aside>
    {{ $t('example.warning') }}
    <a
      href="https://armour.github.io/vue-typescript-admin-docs/guide/essentials/tags-view.html"
      target="_blank"
      >Document</a
    >
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Warning'
})
</script>
