<template>
  <div class="app-container">
    <aside>
      {{ $t('guide.description') }}
      <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js.</a>
    </aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
      {{ $t('guide.button') }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { driver, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { steps } from './steps'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Guide',
  setup() {
    const driver = ref<Driver | null>(null)
    return {
      driver
    }
  },
  mounted() {
    this.driver = driver({
      steps
    })
  },
  methods: {
    guide() {
      if (this.driver) {
        this.driver.drive(0)
      }
    }
  }
})
</script>
