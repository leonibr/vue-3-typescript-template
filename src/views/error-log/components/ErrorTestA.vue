<template>
  <div>
    <!--error code-->
    {{ a.a }}
    <!--error code-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorTestA',
  setup() {
    return {
      a: undefined as any
    }
  }
})
</script>
