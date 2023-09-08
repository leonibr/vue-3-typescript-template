<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <icon :data="languageSvg" class="international-icon" />
    </div>
    <template v-slot:dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh'" command="zh"> 中文 </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" command="en"> English </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'es'" command="es"> Español </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'ja'" command="ja"> 日本語 </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'ko'" command="ko"> 한국어 </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'it'" command="it"> Italiano </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import settings from '@/settings'
import { defineComponent } from 'vue'
import { useAppStore } from '@/stores/app-store'
import languageSvg from '@/icons/svg/language.svg'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'LangSelect',
  setup() {
    const appStore = useAppStore()
    return {
      appStore,
      languageSvg
    }
  },
  computed: {
    language() {
      return this.appStore.language
    }
  },
  methods: {
    handleSetLanguage(lang: string) {
      this.$i18n.locale = lang
      this.appStore.setLanguage(lang)
      document.documentElement.lang = lang
      const title = this.$route.meta.title
        ? `${this.$t(`route.${this.$route.meta.title}`)} - ${settings.title}`
        : `${settings.title}`
      document.title = title
      ElMessage({
        message: this.$t('components.changeLanguageTips').toString(),
        type: 'success'
      })
    }
  }
})
</script>

<style scoped lang="scss">
.international-icon {
  margin-top: 17px;
}
</style>
