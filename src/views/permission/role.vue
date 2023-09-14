<template>
  <div class="app-container">
    <el-button type="primary" @click="handleCreateRole">
      {{ $t('permission.createRole') }}
    </el-button>

    <el-table :data="rolesList" style="width: 100%; margin-top: 30px" border>
      <el-table-column align="center" label="Role Key" width="220">
        <template v-slot="{ row }">
          {{ row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template v-slot="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template v-slot="{ row }">
          {{ row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template v-slot="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t('permission.editPermission') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('permission.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogType === 'edit' ? 'Edit Role' : 'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesTreeData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import path from 'path-browserify'
import { cloneDeep } from 'lodash'
import { type RouteRecordRaw } from 'vue-router'
import { getRoutes, getRoles, createRole, deleteRole, updateRole } from '@/api/roles'
import { defineComponent, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage, ElTree, ElNotification } from 'element-plus'

interface IRole {
  key: number
  name: string
  description: string
  routes: RouteRecordRaw[]
}

interface IRoutesTreeData {
  children: IRoutesTreeData[]
  title: string
  path: string
}

const defaultRole: IRole = {
  key: 0,
  name: '',
  description: '',
  routes: []
}

export default defineComponent({
  name: 'RolePermission',
  setup() {
    const tree = reactive<typeof ElTree>({} as unknown as typeof ElTree)
    const role = reactive(Object.assign({}, defaultRole))
    const reshapedRoutes = reactive<RouteRecordRaw[]>([])
    const serviceRoutes = ref<RouteRecordRaw[]>([])
    const rolesList = ref<IRole[]>([])
    const dialogVisible = ref(false)
    const dialogType = ref('new')
    const checkStrictly = ref(false)
    const defaultProps = reactive({
      children: 'children',
      label: 'title'
    })

    return {
      defaultProps,
      role,
      reshapedRoutes,
      serviceRoutes,
      rolesList,
      dialogVisible,
      dialogType,
      checkStrictly,
      tree
    }
  },
  async created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  computed: {
    routesTreeData() {
      const routesData = this.generateTreeData(this.reshapedRoutes)
      return routesData
    }
  },
  methods: {
    generateTreeData(routes: RouteRecordRaw[]) {
      const data: IRoutesTreeData[] = []
      for (const route of routes) {
        const tmp: IRoutesTreeData = {
          children: [],
          title: '',
          path: ''
        }
        tmp.title = this.$t(`route.${route.meta?.title}`).toString()
        tmp.path = route.path
        if (route.children) {
          tmp.children = this.generateTreeData(route.children)
        }
        data.push(tmp)
      }
      return data
    },
    async getRoutes() {
      const { data } = await getRoutes({
        /* Your params here */
      })
      this.serviceRoutes = data.routes
      this.reshapedRoutes = reactive(this.reshapeRoutes(data.routes))
    },
    async getRoles() {
      const { data } = await getRoles({
        /* Your params here */
      })
      this.rolesList = data.items
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    reshapeRoutes(routes: RouteRecordRaw[], basePath = '/') {
      const reshapedRoutes: RouteRecordRaw[] = []
      for (let route of routes) {
        // Skip hidden routes
        if (route.meta && route.meta.hidden) {
          continue
        }
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChild && (!route.meta || !route.meta.alwaysShow)) {
          route = onlyOneShowingChild
        }
        const data = {
          path: path.resolve(basePath, route.path),
          meta: {
            title: route.meta && route.meta.title
          }
        } as unknown as RouteRecordRaw
        // Recursive generate child routes
        if (route.children) {
          data.children = this.reshapeRoutes(route.children, data.path)
        }
        reshapedRoutes.push(data)
      }
      return reshapedRoutes
    },
    flattenRoutes(routes: RouteRecordRaw[]) {
      let data: RouteRecordRaw[] = []
      routes.forEach((route) => {
        data.push(route)
        if (route.children) {
          const temp = this.flattenRoutes(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleCreateRole() {
      this.role = reactive(Object.assign({}, defaultRole))
      if (this.$refs.tree) {
        ;(this.$refs.tree as typeof ElTree).setCheckedKeys([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    handleEdit(scope: any) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = reactive(cloneDeep(scope.row))
      this.$nextTick(() => {
        const routes = this.flattenRoutes(this.reshapeRoutes(this.role.routes))
        const treeData = this.generateTreeData(routes)
        const treeDataKeys = treeData.map((t) => t.path)
        ;(this.$refs.tree as typeof ElTree).setCheckedKeys(treeDataKeys)
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },

    handleDelete(scope: any) {
      const { $index, row } = scope
      ElMessageBox({
        title: 'Warning',
        message: 'Confirm to remove the role?',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          ElMessage({
            type: 'success',
            message: 'Deleted!'
          })
        })
        .catch((err) => {
          console.error(err)
        })
    },

    generateTree(routes: RouteRecordRaw[], basePath = '/', checkedKeys: string[]) {
      const res: RouteRecordRaw[] = []
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)
        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }
        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },

    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      const checkedKeys = (this.$refs.tree as typeof ElTree).getCheckedKeys()

      this.role.routes = this.generateTree(cloneDeep(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.role.key, { role: this.role })
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await createRole({ role: this.role })
        this.role.key = data.key
        this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      ElNotification({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },

    // Reference: src/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children: RouteRecordRaw[] = [], parent: RouteRecordRaw) {
      let onlyOneChild: RouteRecordRaw | null = null
      const showingChildren = children.filter((item) => !item.meta || !item.meta.hidden)
      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path === '' ? '/' : parent.path, onlyOneChild.path)
        return onlyOneChild
      }
      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '' }
        return onlyOneChild
      }
      return false
    }
  }
})
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
