<template>
  <article-detail :is-edit="false" />
</template>

<script lang="ts">
import ArticleDetail from './components/ArticleDetail.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreateArticle',
  components: {
    ArticleDetail
  }
})
</script>
