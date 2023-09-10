<template>
  <div class="login-container">
    <el-form
      ref="loginFormHtml"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        >
          <template #prefix>
            <span class="svg-container">
              <icon :data="svg.user" />
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <span class="svg-container">
                <icon :data="svg.password" />
              </span>
            </template>
            <template #suffix>
              <span class="show-pwd" @click="showPwd">
                <icon :data="passwordType === 'password' ? svg.eyeOff : svg.eyeOn" />
              </span>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>

      <div style="position: relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }} </span>
        </div>
        <div class="tips">
          <span>{{ $t('login.username') }} : editor </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }} </span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog = true">
          {{ $t('login.thirdparty') }}
        </el-button>
      </div>
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" v-model:visible="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ElForm as Form, ElInput } from 'element-plus'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
// import SocialSign from './components/SocialSignin.vue'
import { defineComponent, reactive, ref, watch } from 'vue'
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
import { useUserStore } from '@/stores/user-store'
import { Dictionary } from 'vue-router/types/router'
import user from '@/icons/svg/user.svg'
import password from '@/icons/svg/password.svg'
import eyeOff from '@/icons/svg/eye-off.svg'
import eyeOn from '@/icons/svg/eye-on.svg'

const validateUsername = (rule: any, value: string, callback: (vare?: any) => void) => {
  if (!isValidUsername(value)) {
    callback(new Error('Please enter the correct user name'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: (vare?: any) => void) => {
  if (value.length < 6) {
    callback(new Error('The password can not be less than 6 digits'))
  } else {
    callback()
  }
}

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  components: {
    LangSelect
    // SocialSign
  },
  setup() {
    const route = useRoute()
    const userStore = useUserStore()
    const passwordType = ref('password')
    const loading = ref(false)
    const showDialog = ref(false)
    const capsTooltip = ref(false)
    const redirect = ref<string | null>(null)
    const otherQuery = reactive<Dictionary<string>>({})
    const loginForm = reactive({
      username: 'admin',
      password: '111111'
    })
    const loginRules = reactive({
      username: [{ validator: validateUsername, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }]
    })

    return {
      loginForm,
      loginRules,
      passwordType,
      loading,
      showDialog,
      capsTooltip,
      redirect,
      route,
      userStore,
      otherQuery,
      svg: {
        user,
        password,
        eyeOff,
        eyeOn
      }
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      ;(this.$refs.username as typeof ElInput).focus()
    } else if (this.loginForm.password === '') {
      ;(this.$refs.password as typeof ElInput).focus()
    }
    watch(reactive(this.route), (route) => this.onRouteChange(route))
  },
  methods: {
    onRouteChange(route: RouteLocationNormalizedLoaded) {
      // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
      // See https://github.com/vuejs/vue-router/pull/2050 for details
      const query = route.query as Dictionary<string>
      if (query) {
        this.redirect = query.redirect
        this.otherQuery = this.getOtherQuery(query)
      }
    },
    checkCapslock(e: KeyboardEvent) {
      const { key } = e
      this.capsTooltip = key !== null && key.length === 1 && key >= 'A' && key <= 'Z'
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        ;(this.$refs.password as typeof ElInput).focus()
      })
    },

    handleLogin() {
      ;(this.$refs.loginFormHtml as typeof Form).validate(async(valid: boolean) => {
        if (valid) {
          this.loading = true
          await this.userStore.Login(this.loginForm)
          this.$router
            .push({
              path: this.redirect || '/',
              query: this.otherQuery
            })
            .catch((err) => {
              console.warn(err)
            })
          // Just to simulate the time of the request
          setTimeout(() => {
            this.loading = false
          }, 0.5 * 1000)
        } else {
          return false
        }
      })
    },

    getOtherQuery(query: Dictionary<string>) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {} as Dictionary<string>)
    }
  }
})
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input {
      color: $loginCursorColor;
    }
    input::first-line {
      color: $lightGray;
    }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 99%;

    .el-input__wrapper {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 4px;
      width: 100%;
      padding: 0; // 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    .svg-icon {
      width: 1em;
      height: 1em;
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
