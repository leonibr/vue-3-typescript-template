<template>
  <div class="components-container">
    <aside>
      <a href="https://github.com/PanJiaChen/vue-countTo" target="_blank">countTo-component</a>
    </aside>
    <count-up
      ref="countUp"
      :start-val="startVal"
      :end-val="endVal"
      :duration="duration"
      :decimalPlaces="decimals"
      :separator="separator"
      :prefix="prefix"
      :suffix="suffix"
      :autoplay="false"
      class="count"
    >
      <template #prefix>{{ prefix }}</template>
      <template #suffix>{{ suffix }}</template>
    </count-up>
    <div style="margin-left: 25%; margin-top: 40px">
      <label class="label" for="startValInput">
        startVal:
        <input v-model="setStartVal" type="number" name="startValInput" />
      </label>
      <label class="label" for="endValInput">
        endVal:
        <input v-model="setEndVal" type="number" name="endVaInput" />
      </label>
      <label class="label" for="durationInput">
        duration:
        <input v-model="setDuration" type="number" name="durationInput" />
      </label>
      <div class="startBtn count-btn" @click="start">Start</div>
      <div class="pause-resume-btn count-btn" @click="pauseResume">pause/resume</div>
      <br />
      <label class="label" for="decimalsInput">
        decimals:
        <input v-model="setDecimals" type="number" name="decimalsInput" />
      </label>
      <label class="label" for="separatorInput">
        separator:
        <el-tooltip class="box-item" effect="dark" content="Api Removed!" placement="top-start">
          <input v-model="setSeparator" name="separatorInput" readonly />
        </el-tooltip>
      </label>
      <label class="label" for="prefixInput">
        prefix:
        <input v-model="setPrefix" name="prefixInput" />
      </label>
      <label class="label" for="suffixInput">
        suffix:
        <input v-model="setSuffix" name="suffixInput" />
      </label>
    </div>
    <aside>
      &lt;count-to :start-val=&#x27;{{ startVal }}&#x27; :end-val=&#x27;{{ endVal }}&#x27;
      :duration=&#x27;{{ duration }}&#x27; :decimals=&#x27;{{ decimals }}&#x27; :separator=&#x27;{{
        separator
      }}&#x27; :prefix=&#x27;{{ prefix }}&#x27; :suffix=&#x27;{{ suffix }}&#x27; :autoplay=false&gt;
    </aside>
  </div>
</template>

<script lang="ts">
import CountUp from 'vue-countup-v3'
import { ref, defineComponent } from 'vue'
import { ElNotification } from 'element-plus'

export default defineComponent({
  name: 'CountToDemo',
  components: {
    CountUp
  },
  setup() {
    const setStartVal = ref(0)
    const setEndVal = ref(2017)
    const setDuration = ref(4)
    const setDecimals = ref(2)
    const setSeparator = ref('☠️')
    const setSuffix = ref(' rmb')
    const setPrefix = ref('¥ ')
    const countUp = ref<InstanceType<typeof CountUp>>()
    return {
      setStartVal,
      setEndVal,
      setDuration,
      setDecimals,
      setSeparator,
      setSuffix,
      setPrefix,
      countUp
    }
  },
  computed: {
    startVal() {
      if (this.setStartVal) {
        return this.setStartVal
      } else {
        return 0
      }
    },
    endVal() {
      if (this.setEndVal) {
        return this.setEndVal
      } else {
        return 0
      }
    },
    duration() {
      if (this.setDuration) {
        return this.setDuration
      } else {
        return 100
      }
    },
    decimals() {
      if (this.setDecimals) {
        if (this.setDecimals < 0 || this.setDecimals > 20) {
          alert('digits argument must be between 0 and 20')
          return 0
        }
        return this.setDecimals
      } else {
        return 0
      }
    },
    separator() {
      return this.setSeparator
    },
    suffix() {
      return this.setSuffix
    },

    prefix() {
      return this.setPrefix
    }
  },
  methods: {
    start() {
      ;(this.$refs.countUp as any).restart()
    },

    pauseResume() {
      ElNotification.warning({
        message: 'Not implemented!'
      })
      // this.$refs.countUp && (this.$refs.count as any).pauseResume()
    }
  }
})
</script>

<style lang="scss" scoped>
.count {
  font-size: 50px;
  color: #f6416c;
  display: block;
  margin: 10px 0;
  text-align: center;
  font-size: 80px;
  font-weight: 500;
}

.count-btn {
  display: inline-block;
  margin: 10px 0;
  font-weight: 500;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  padding: 2px 15px;
  font-size: 12px;
  border-radius: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  border-color: #d9d9d9;

  &:hover {
    color: #4ab7bd;
    background-color: #fff;
    border-color: #4ab7bd;
  }
}

.label {
  color: #2f4f4f;
  font-size: 16px;
  display: inline-block;
  margin: 15px 30px 15px 0;
}

input {
  position: relative;
  display: inline-block;
  padding: 4px 7px;
  width: 70px;
  height: 28px;
  cursor: text;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.startBtn {
  margin-right: 10px;
  font-size: 20px;
  color: #30b08f;
  background-color: #fff;

  &:hover {
    background-color: #30b08f;
    color: #fff;
    border-color: #30b08f;
  }
}

.pause-resume-btn {
  font-size: 20px;
  color: #e65d6e;
  background-color: #fff;

  &:hover {
    background-color: #e65d6e;
    color: #fff;
    border-color: #e65d6e;
  }
}
</style>
