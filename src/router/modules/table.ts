import { type RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const tableRoutes: RouteRecordRaw = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'table',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamic-table/index.vue'),
      name: 'DynamicTable',
      meta: { title: 'dynamicTable' }
    },
    {
      path: 'draggable-table',
      component: () => import('@/views/table/draggable-table.vue'),
      name: 'DraggableTable',
      meta: { title: 'draggableTable' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table.vue'),
      name: 'InlineEditTable',
      meta: { title: 'inlineEditTable' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table.vue'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    }
  ]
}

export default tableRoutes
