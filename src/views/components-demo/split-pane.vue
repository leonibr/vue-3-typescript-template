<template>
  <div class="components-container">
    <aside>
      <strong>SplitPanes</strong> If you've used
      <a href="https://codepen.io/" target="_blank"> codepen</a>,
      <a href="https://jsfiddle.net/" target="_blank"> jsfiddle </a>will not be unfamiliar.
      <a href="https://antoniandre.github.io/splitpanes/" target="_blank"> Github repository</a>
    </aside>

    <splitpanes class="default-theme" @resize="resize">
      <pane>
        <div class="left-container" />
      </pane>
      <pane>
        <splitpanes horizontal>
          <pane size="40"> <div class="top-container" /> </pane>
          <pane size="60"> <div class="bottom-container" /> </pane>
        </splitpanes>
      </pane>
    </splitpanes>
  </div>
</template>

<script lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SplitPaneDemo',
  components: {
    Splitpanes,
    Pane
  },
  methods: {
    resize() {
      // Handle resize
    }
  }
})
</script>

<style lang="scss" scoped>
.components-container {
  height: 100vh;
}

.left-container {
  background-color: #f38181;
  height: 100%;
}

.right-container {
  background-color: #fce38a;
  height: 200px;
}

.top-container {
  background-color: #fce38a;
  width: 100%;
  height: 100%;
}

.bottom-container {
  width: 100%;
  background-color: #95e1d3;
  height: 100%;
}
</style>
