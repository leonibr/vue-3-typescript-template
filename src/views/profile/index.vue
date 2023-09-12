<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defaultProfile } from '@/views/profile/model/profile'
import Account from './components/Account.vue'
import Activity from './components/Activity.vue'
import Timeline from './components/Timeline.vue'
import UserCard from './components/UserCard.vue'
import { defineComponent, ref } from 'vue'
import { useUserStore } from '../../stores/user-store'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Profile',
  components: {
    Account,
    Activity,
    Timeline,
    UserCard
  },
  setup() {
    const user = ref(defaultProfile)
    const activeTab = ref('activity')
    const userStore = useUserStore()

    return {
      user,
      userStore,
      activeTab
    }
  },
  created() {
    this.getUser()
  },
  computed: {
    name() {
      return this.userStore.name
    },
    email() {
      return this.userStore.email
    },
    avatar() {
      return this.userStore.avatar
    },
    roles() {
      return this.userStore.roles
    }
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        email: this.email,
        avatar: this.avatar,
        roles: this.roles.join(' | ')
      }
    }
  }
})
</script>
