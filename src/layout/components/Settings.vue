<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">
        {{ $t('settings.title') }}
      </h3>

      <div class="drawer-item">
        <span>{{ $t('settings.theme') }}</span>
        <theme-picker
          style="float: right; height: 26px; margin: -3px 8px 0 0"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.showTagsView') }}</span>
        <el-switch v-model="showTagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.showSidebarLogo') }}</span>
        <el-switch v-model="showSidebarLogo" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.fixedHeader') }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.sidebarTextTheme') }}</span>
        <el-switch v-model="sidebarTextTheme" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ThemePicker from '@/components/ThemePicker/index.vue'
import { defineComponent, ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings-store'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Settings',
  components: {
    ThemePicker
  },
  setup() {
    const settingStore = useSettingsStore()
    const fixedHeader = ref(settingStore.fixedHeader)
    watch(fixedHeader, (value) => settingStore.changeSetting({ key: 'fixedHeader', value }))
    const showTagsView = ref(settingStore.showTagsView)
    watch(showTagsView, (value) => settingStore.changeSetting({ key: 'showTagsView', value }))
    const showSidebarLogo = ref(settingStore.showSidebarLogo)
    watch(showSidebarLogo, (value) => settingStore.changeSetting({ key: 'showSidebarLogo', value }))
    const sidebarTextTheme = ref(settingStore.sidebarTextTheme)
    watch(sidebarTextTheme, (value) =>
      settingStore.changeSetting({ key: 'sidebarTextTheme', value })
    )
    return {
      fixedHeader,
      showTagsView,
      showSidebarLogo,
      sidebarTextTheme,
      settingStore
    }
  },
  methods: {
    themeChange(value: string) {
      this.settingStore.changeSetting({ key: 'theme', value })
    }
  }
})
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
