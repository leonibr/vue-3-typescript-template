<template>
  <div>
    <!--error code-->
    {{ (b = b.b) }}
    <!--error code-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorTestB'
})
</script>
