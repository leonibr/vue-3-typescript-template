<template>
  <el-card class="box-card-component" style="margin-left: 8px">
    <template v-slot:header>
      <div class="box-card-header">
        <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png" />
      </div>
    </template>
    <div style="position: relative">
      <pan-thumb :image="avatar" class="panThumb" />
      <mallki class="mallki-text" text="vue-typescript-admin" />
      <div style="padding-top: 35px" class="progress-item">
        <span>Vue</span>
        <el-progress :percentage="51" />
      </div>
      <div class="progress-item">
        <span>Typescript</span>
        <el-progress :percentage="45" />
      </div>
      <div class="progress-item">
        <span>CSS</span>
        <el-progress :percentage="4" />
      </div>
      <div class="progress-item">
        <span>ESLint</span>
        <el-progress :percentage="100" status="success" />
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import PanThumb from '@/components/PanThumb/index.vue'
import Mallki from '@/components/TextHoverEffect/Mallki.vue'
import { useUserStore } from '@/stores/user-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BoxCard',
  components: {
    PanThumb,
    Mallki
  },
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  computed: {
    name() {
      return this.userStore.name
    },

    avatar() {
      return this.userStore.avatar
    },

    roles() {
      return this.userStore.roles
    }
  }
})
</script>

<style lang="scss">
.box-card-component {
  .el-card__header {
    padding: 0px !important;
  }
}

.panThumb {
  z-index: 100;
  height: 70px !important;
  width: 70px !important;
  position: absolute !important;
  top: -45px;
  left: 0px;
  border: 5px solid #ffffff;
  background-color: #fff;
  margin: auto;
  box-shadow: none !important;

  .pan-info {
    box-shadow: none !important;
  }
}
</style>

<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;

    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;

      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }

  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }

  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }

  @media only screen and (max-width: 1510px) {
    .mallki-text {
      display: none;
    }
  }
}
</style>
