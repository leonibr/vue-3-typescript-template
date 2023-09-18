<template>
  <div class="draggableList">
    <div :style="{ width: list1width }" class="draggableList-list">
      <h3>{{ list1Title }}</h3>
      <draggable :list="mutableList1" group="article" class="dragArea">
        <div v-for="element in mutableList1" :key="element.id" class="list-complete-item">
          <div class="list-complete-item-handle">
            {{ element.id }}[{{ element.author }}] {{ element.title }}
          </div>
          <div style="position: absolute; right: 0px">
            <span
              style="float: right; margin-top: -16px; margin-right: 5px"
              @click="deleteEle(element)"
            >
              <el-icon class="el-icon-delete">
                <delete />
              </el-icon>
            </span>
          </div>
        </div>
      </draggable>
    </div>
    <div :style="{ width: list2width }" class="draggableList-list">
      <h3>{{ list2Title }}</h3>
      <draggable :list="list2" group="article" class="dragArea">
        <div v-for="element in list2" :key="element.id" class="list-complete-item">
          <div class="list-complete-item-handle2" @click="pushEle(element)">
            {{ element.id }} [{{ element.author }}] {{ element.title }}
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'
import { type IArticleData } from '@/api/types.d'
import { defineComponent, reactive } from 'vue'
import { Delete } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'DraggableList',
  components: {
    draggable: VueDraggableNext,
    Delete
  },
  props: {
    list1: {
      type: Array<IArticleData>,
      default: () => []
    },
    list2: {
      type: Array<IArticleData>,
      default: () => []
    },
    list1Title: {
      type: String,
      default: 'list1'
    },
    list2Title: {
      type: String,
      default: 'list2'
    },
    list1width: {
      type: String,
      default: '48%'
    },
    list2width: {
      type: String,
      default: '48%'
    }
  },
  setup(props) {
    const { list1, list2 } = props
    const mutableList1 = reactive(list1)
    const mutableList2 = reactive(list2)
    return {
      mutableList1,
      mutableList2
    }
  },
  methods: {
    isNotInList1(v: IArticleData) {
      return this.mutableList1.every((k) => v.id !== k.id)
    },

    isNotInList2(v: IArticleData) {
      return this.mutableList2.every((k) => v.id !== k.id)
    },

    deleteEle(ele: IArticleData) {
      for (const item of this.mutableList1) {
        if (item.id === ele.id) {
          const index = this.mutableList1.indexOf(item)
          this.mutableList1.splice(index, 1)
          break
        }
      }
      if (this.isNotInList2(ele)) {
        this.mutableList2.unshift(ele)
      }
    },

    pushEle(ele: IArticleData) {
      for (const item of this.mutableList2) {
        if (item.id === ele.id) {
          const index = this.mutableList2.indexOf(item)
          this.mutableList2.splice(index, 1)
          break
        }
      }
      if (this.isNotInList1(ele)) {
        this.mutableList1.push(ele)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.draggableList {
  background: #fff;
  padding-bottom: 40px;

  &:after {
    content: '';
    display: table;
    clear: both;
  }

  .draggableList-list {
    float: left;
    padding-bottom: 30px;

    &:first-of-type {
      margin-right: 2%;
    }

    .dragArea {
      margin-top: 15px;
      min-height: 50px;
      padding-bottom: 30px;
    }
  }
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}

.list-complete-item-handle2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}

.list-complete-item.sortable-chosen {
  background: #4ab7bd;
}

.list-complete-item.sortable-ghost {
  background: #30b08f;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
}

.el-icon-delete {
  color: #ff4949;

  &:hover {
    svg {
      color: #eee;
      background-color: #ff4949;
    }
  }
}
</style>
