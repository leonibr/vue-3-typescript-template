<template>
  <div class="createPost-container">
    <el-form ref="postFormRef" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <comment-dropdown v-model="postForm.disableComment" />
        <platform-dropdown v-model="postForm.platforms" />
        <source-url-dropdown v-model="postForm.sourceURL" />
        <el-button v-loading="loading" style="margin-left: 10px" type="success" @click="submitForm">
          Publish
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm"> Draft </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <material-input v-model="postForm.title" :maxlength="100" name="name" required>
                Title
              </material-input>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="Author:" class="postInfo-container-item">
                    <el-select
                      v-model="postForm.author"
                      :remote-method="getRemoteUserList"
                      filterable
                      default-first-option
                      remote
                      placeholder="Search user"
                    >
                      <el-option
                        v-for="(item, index) in userListOptions"
                        :key="item + index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item
                    label-width="120px"
                    label="Publish Time:"
                    class="postInfo-container-item"
                  >
                    <el-date-picker
                      v-model="timestamp"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="Select date and time"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
                    label-width="90px"
                    label="Importance:"
                    class="postInfo-container-item"
                  >
                    <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display: inline-block"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px" label-width="70px" label="Summary:">
          <el-input
            v-model="postForm.abstractContent"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the content"
          />
          <span v-show="abstractContentLength" class="word-counter"
            >{{ abstractContentLength }}words</span
          >
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px">
          <tinymce v-if="tinymceActive" ref="editor" v-model="postForm.fullContent" :height="400" />
        </el-form-item>

        <el-form-item prop="imageURL" style="margin-bottom: 30px">
          <upload-image v-model="postForm.imageURL" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { isValidURL } from '@/utils/validate'
import { getArticle, defaultArticleData } from '@/api/articles'
import { getUsers } from '@/api/users'
import MaterialInput from '@/components/MaterialInput/index.vue'
import Sticky from '@/components/Sticky/index.vue'
import Tinymce from '@/components/Tinymce/index.vue'
import UploadImage from '@/components/UploadImage/index.vue'
import Warning from './Warning.vue'
import { type RouteLocationNormalizedLoaded } from 'vue-router'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { ElMessage, ElNotification, ElForm } from 'element-plus'
import { defineComponent, ref, watch } from 'vue'
import { useTagsViewStore, type ITagView } from '@/stores/tags-view-store'
import { useAppStore } from '@/stores/app-store'

export default defineComponent({
  name: 'ArticleDetail',
  components: {
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown,
    MaterialInput,
    Sticky,
    Tinymce,
    UploadImage,
    Warning
  },
  props: {
    isEdit: { type: Boolean, default: false }
  },
  created() {
    if (this.isEdit) {
      const id = (this.$route.params && this.$route.params.id) as string
      this.fetchData(parseInt(id))
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of this.setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221]
    this.tempTagView = Object.assign({}, this.$route) as ITagView
  },
  setup() {
    const postForm = ref(Object.assign({}, defaultArticleData))
    const postFormRef = ref<typeof ElForm | null>(null)
    const timestamp = ref(postForm.value.timestamp)

    // set and get is useful when the data
    // returned by the backend api is different from the frontend
    // e.g.: backend return => "2013-06-25 06:59:25"
    //       frontend need timestamp => 1372114765000
    watch(timestamp, (vl: string | number | Date) => (postForm.value.timestamp = +new Date(vl)))
    const loading = ref(false)
    const userListOptions = ref([])

    const tempTagView = ref<ITagView | null>(null)
    const tinymceActive = ref(true)
    const tagviewStore = useTagsViewStore()
    const appStore = useAppStore()

    return {
      postForm,
      postFormRef,
      loading,
      userListOptions,
      tempTagView,
      timestamp,
      tinymceActive,
      appStore,
      tagviewStore
    }
  },
  mounted() {
    const rules = ref({
      imageURL: [{ validator: this.validateRequire }],
      title: [{ validator: this.validateRequire }],
      fullContent: [{ validator: this.validateRequire }],
      sourceURL: [{ validator: this.validateSourceUrl, trigger: 'blur' }]
    })
    return { rules }
  },
  computed: {
    abstractContentLength() {
      return this.postForm.abstractContent.length
    },

    lang() {
      return this.appStore.language
    }
  },

  deactivated() {
    this.tinymceActive = false
  },
  activated() {
    this.tinymceActive = true
  },
  methods: {
    validateRequire(rule: any, value: string, callback: (val?: any) => void) {
      if (value === '') {
        if (rule.field === 'imageURL') {
          ElMessage({
            message: 'Upload cover image is required',
            type: 'error'
          })
        } else {
          ElMessage({
            message: rule.field + ' is required',
            type: 'error'
          })
        }
        callback(new Error(rule.field + ' is required'))
      } else {
        callback()
      }
    },
    validateSourceUrl(rule: any, value: string, callback: (arg?: any) => void) {
      if (value) {
        if (isValidURL(value)) {
          callback()
        } else {
          ElMessage({
            message: 'Invalid URL',
            type: 'error'
          })
          callback(new Error('Invalid URL'))
        }
      } else {
        callback()
      }
    },

    async fetchData(id: number) {
      try {
        const { data } = await getArticle(id, {
          /* Your params here */
        })
        this.postForm = data.article
        // Just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.abstractContent += `   Article Id:${this.postForm.id}`
        const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
        // Set tagsview title
        this.setTagsViewTitle(title)
        // Set page title
        this.setPageTitle(title)
      } catch (err) {
        console.error(err)
      }
    },

    setTagsViewTitle(title: string) {
      const tagView = this.tempTagView
      if (tagView) {
        tagView.title = `${title}-${this.postForm.id}`
        this.tagviewStore.updateVisitedView(tagView)
      }
    },

    setPageTitle(title: string) {
      document.title = `${title} - ${this.postForm.id}`
    },

    submitForm() {
      ;(this.$refs.postFormRef as typeof ElForm).validate((valid: boolean) => {
        if (valid) {
          this.loading = true
          ElNotification({
            title: 'Success',
            message: 'The post published successfully',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          // Just to simulate the time of the request
          setTimeout(() => {
            this.loading = false
          }, 0.5 * 1000)
        } else {
          console.error('Submit Error!')
          return false
        }
      })
    },

    draftForm() {
      if (this.postForm.fullContent.length === 0 || this.postForm.title.length === 0) {
        ElMessage({
          message: 'Title and detail content are required',
          type: 'warning'
        })
        return
      }
      ElMessage({
        message: 'The draft saved successfully',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },

    async getRemoteUserList(name: string) {
      const { data } = await getUsers({ name })
      if (!data.items) return
      this.userListOptions = data.items.map((v: any) => v.name)
    }
  }
})
</script>

<style lang="scss">
.article-textarea {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>

<style lang="scss" scoped>
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
</style>
