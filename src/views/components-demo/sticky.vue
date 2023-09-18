<template>
  <div>
    <sticky :z-index="10" class-name="sub-navbar">
      <div class="flex" style="justify-content: center">
        <el-dropdown trigger="click">
          <el-button plain>
            Platform<el-icon class="el-icon--right"><caret-bottom /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu class="no-border">
              <el-checkbox-group v-model="platforms" style="padding: 5px 15px">
                <el-checkbox v-for="item in platformsOptions" :key="item.key" :label="item.key">
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown trigger="click">
          <el-button plain>
            Link<el-icon class="el-icon--right"><caret-bottom /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu class="no-padding no-border" style="width: 300px">
              <el-input v-model="url" placeholder="Please enter the content">
                <template v-slot:prepend> Url </template>
              </el-input>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="time-container">
          <el-date-picker
            v-model="time"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Release time"
            :picker-options="pickerOptions"
          />
        </div>

        <el-button style="margin-left: 10px" type="success"> publish </el-button>
      </div>
    </sticky>

    <div class="components-container">
      <aside>Sticky header, {{ $t('components.stickyTips') }}</aside>
      <div v-for="i in topList" :key="i">placeholder {{ i }}</div>
      <sticky :sticky-top="200">
        <el-button type="primary"> placeholder </el-button>
      </sticky>
      <div v-for="i in bottomList" :key="i">placeholder {{ i }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Sticky from '@/components/Sticky/index.vue'
import { defineComponent, ref } from 'vue'
import { CaretBottom } from '@element-plus/icons-vue'
export default defineComponent({
  name: 'StickyDemo',
  components: {
    Sticky,
    CaretBottom
  },
  setup() {
    const time = ref(Date)
    const url = ref('')
    const platforms = ref(['a-platform'])
    const platformsOptions = ref([
      { key: 'a-platform', name: 'platformA' },
      { key: 'b-platform', name: 'platformB' },
      { key: 'c-platform', name: 'platformC' }
    ])
    const topList = Array.from({ length: 13 }, (value, index) => index + 1)
    const bottomList = Array.from({ length: 38 }, (value, index) => index + 1)

    return {
      time,
      url,
      platforms,
      platformsOptions,
      bottomList,
      topList
    }
  },
  computed: {
    pickerOptions: () => ({
      disabledDate(time: Date) {
        return time.getTime() > Date.now()
      }
    })
  }
})
</script>

<style lang="scss" scoped>
:deep(.sub-navbar) {
  line-height: inherit;
  min-height: 50px;
  padding-top: 10px;

  .el-dropdown {
    margin-right: 4px;
  }
}
.components-container div {
  margin: 10px;
}

.time-container {
  display: inline-block;
}
</style>
