<template>
  <article-detail :is-edit="true" />
</template>

<script lang="ts">
import ArticleDetail from './components/ArticleDetail.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditArticle',
  components: {
    ArticleDetail
  }
})
</script>
