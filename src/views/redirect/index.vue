<template>
  <div>loading...</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Redirect',
  created() {
    const route = useRoute()
    const { params, query } = route
    const { path } = params

    const router = useRouter()
    router.replace({ path: '/' + path, query }).catch((err) => console.warn({ redirect: err }))
  }
})
</script>
