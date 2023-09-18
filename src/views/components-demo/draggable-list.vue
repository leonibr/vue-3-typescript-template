<template>
  <div class="components-container">
    <aside>
      draggable-list base on
      <a href="https://github.com/anish2690/vue-draggable-next" target="_blank"
        >Vue-Draggable-next</a
      >
    </aside>
    <div class="editor-container">
      <draggable-list :list1="list1" :list2="list2" list1-title="List" list2-title="Article pool" />
    </div>
  </div>
</template>

<script lang="ts">
import { getArticles } from '@/api/articles'
import DraggableList from '@/components/DraggableList/index.vue'
import { defineComponent, ref } from 'vue'
import { type IArticleData } from '@/api/types'

export default defineComponent({
  name: 'DraggableListDemo',
  components: {
    DraggableList
  },
  setup() {
    const list1 = ref<IArticleData[]>([])
    const list2 = ref<IArticleData[]>([])
    return {
      list1,
      list2
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { data } = await getArticles({
        /* Your params here */
      })
      const { items } = data
      this.list1.push(...items.splice(0, 5))

      this.list2.push(...items)
    }
  }
})
</script>
