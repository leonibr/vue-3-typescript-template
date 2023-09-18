<template>
  <div class="icons-container">
    <aside>
      <a
        href="https://armour.github.io/vue-typescript-admin-docs/guide/advanced/icon.html"
        target="_blank"
        >Add and use
      </a>
    </aside>
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div class="grid">
          <div
            v-for="item of Object.keys(svgs)"
            :key="item"
            @click="handleClipboard(generateSvgIconCode(svgs[item]), $event)"
          >
            <el-tooltip placement="top">
              <template #content>
                {{ generateSvgIconCode(svgs[item]) }}
              </template>
              <div class="icon-item">
                <component :is="svgs[item]" class="svg-item disabled" />
                <span class="icon-name">{{ getName(svgs[item]) }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons*">
        <el-alert
          title="Font Icons Removed in Element-Plus. use Svg instead"
          type="warning"
          effect="dark"
        />
        <div class="grid">
          <div
            v-for="item of svgIcons"
            :key="item"
            @click="handleClipboard(generateElementIconCode(item), $event)"
          >
            <el-tooltip placement="top">
              <template #content>
                {{ generateElementIconCode(item) }}
              </template>
              <div class="icon-item">
                <icon :data="item" />
                <span>{{ getName(item) }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { handleClipboard } from '@/utils/clipboard'
import elementIcons from './element-icons'
import svgIcons from './svg-icons'
import * as svgs from '@element-plus/icons-vue'
import { defineComponent } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Icons',
  setup() {
    return {
      svgIcons,
      elementIcons,
      handleClipboard,
      svgs
    }
  },
  methods: {
    generateElementIconCode(symbol: string) {
      return `<i class="el-icon-${symbol}" />`
    },

    generateSvgIconCode(symbol: any) {
      return `<icon :data="${this.getName(symbol)}" />`
    },
    getName(item: any) {
      const name: string = item.name
      const parts = name.toString().split('/')

      return parts[parts.length - 1] ?? ''
    }
  }
})
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;

    .icon-name {
      font-size: 12px;
    }
    .svg-item {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background-color: #24292e23;
    }
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
