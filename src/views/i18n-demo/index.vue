<template>
  <div>
    <el-card class="box-card" style="margin-top: 40px">
      <template #header>
        <div class="clearfix">
          <icon :data="svg.International" />
          <span style="margin-left: 10px">{{ $t('i18nView.title') }}</span>
        </div>
        <div>
          <el-radio-group v-model="lang" size="small">
            <el-radio label="zh" border> 简体中文 </el-radio>
            <el-radio label="en" border> English </el-radio>
            <el-radio label="es" border> Español </el-radio>
            <el-radio label="ja" border> 日本語 </el-radio>
            <el-radio label="ko" border> 한국어 </el-radio>
            <el-radio label="it" style="margin-left: 0; margin-top: 10px" border>
              Italiano
            </el-radio>
          </el-radio-group>
          <el-tag style="margin-top: 15px; display: block" type="info">
            {{ $t('i18nView.note') }}
          </el-tag>
        </div>
      </template>
    </el-card>

    <el-row :gutter="20" style="margin: 100px 15px 50px">
      <el-col :span="12" :xs="24">
        <div class="block">
          <el-date-picker
            v-model="date"
            :placeholder="$t('i18nView.datePlaceholder')"
            type="date"
          />
        </div>
        <div class="block">
          <el-select v-model="value" :placeholder="$t('i18nView.selectPlaceholder')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="block">
          <el-button class="item-btn" size="small">
            {{ $t('i18nView.default') }}
          </el-button>
          <el-button class="item-btn" size="small" type="primary">
            {{ $t('i18nView.primary') }}
          </el-button>
          <el-button class="item-btn" size="small" type="success">
            {{ $t('i18nView.success') }}
          </el-button>
          <el-button class="item-btn" size="small" type="info">
            {{ $t('i18nView.info') }}
          </el-button>
          <el-button class="item-btn" size="small" type="warning">
            {{ $t('i18nView.warning') }}
          </el-button>
          <el-button class="item-btn" size="small" type="danger">
            {{ $t('i18nView.danger') }}
          </el-button>
        </div>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-table :data="tableData" fit highlight-current-row border style="width: 100%">
          <el-table-column
            :label="$t('i18nView.tableName')"
            prop="name"
            width="100"
            align="center"
          />
          <el-table-column
            :label="$t('i18nView.tableDate')"
            prop="date"
            width="120"
            align="center"
          />
          <el-table-column :label="$t('i18nView.tableAddress')" prop="address" />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import local from './local'
import { defineComponent, ref, watch } from 'vue'
import { useAppStore } from '@/stores/app-store'
import i18n from '@/lang'
import International from '@/icons/svg/international.svg'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'I18n',
  setup() {
    const date = ref('')
    const value = ref('')
    const options = ref<{ value: string; label: string }[]>([])
    const tableData = ref([
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }
    ])
    const appStore = useAppStore()
    const lang = ref(appStore.language)

    return {
      date,
      value,
      options,
      tableData,
      lang,
      appStore,
      svg: {
        International
      }
    }
  },
  mounted() {
    watch(
      () => this.lang,
      (newLang) => {
        this.appStore.setLanguage(newLang)
        this.$i18n.locale = newLang
        this.setOptions()
      }
    )
  },
  created() {
    const viewName = 'i18nView'
    if (!i18n.global.getLocaleMessage('en')[viewName]) {
      i18n.global.mergeLocaleMessage('en', local.en)
      i18n.global.mergeLocaleMessage('zh', local.zh)
      i18n.global.mergeLocaleMessage('es', local.es)
      i18n.global.mergeLocaleMessage('ja', local.ja)
      i18n.global.mergeLocaleMessage('ko', local.ko)
      i18n.global.mergeLocaleMessage('it', local.it)
    }
    this.setOptions() // set default select options
  },
  methods: {
    setOptions() {
      this.options = [
        {
          value: '1',
          label: this.$t('i18nView.one')
        },
        {
          value: '2',
          label: this.$t('i18nView.two')
        },
        {
          value: '3',
          label: this.$t('i18nView.three')
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.box-card {
  width: 700px;
  max-width: 100%;
  margin: 20px auto;
}

.item-btn {
  margin-bottom: 15px;
  margin-left: 0px;
}

.block {
  padding: 25px;
}
</style>
