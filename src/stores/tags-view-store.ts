import type { _RouteRecordBase } from 'vue-router'
import { defineStore } from 'pinia'

export interface ITagView extends Partial<_RouteRecordBase> {
  query?: string
  fullPath?: string
  title?: string
}

export interface ITagsViewState {
  visitedViews: ITagView[]
  cachedViews: (string | undefined)[]
}

export const useTagsViewStore = defineStore('tagsViewStore', {
  state: (): ITagsViewState => ({
    visitedViews: [],
    cachedViews: []
  }),
  getters: {
    getVisitedViews: (state) => state.visitedViews,
    getCachedViews: (state) => state.cachedViews
  },
  actions: {
    ADD_VISITED_VIEW(view: ITagView) {
      if (this.getVisitedViews.some((v) => v.path === view.path)) return
      this.getVisitedViews.push(
        Object.assign({}, view, {
          title: view.title || 'no-name'
        })
      )
    },

    ADD_CACHED_VIEW(view: ITagView) {
      if (view.name === null) return
      if (this.getCachedViews.includes(view.name!.toString())) return
      if (!view.meta!.noCache) {
        this.getCachedViews.push(view.name!.toString())
      }
    },

    DEL_VISITED_VIEW(view: ITagView) {
      for (const [i, v] of this.getVisitedViews.entries()) {
        if (v.path === view.path) {
          this.getVisitedViews.splice(i, 1)
          break
        }
      }
    },

    DEL_CACHED_VIEW(view: ITagView) {
      if (view.name === null) return
      const index = this.getCachedViews.indexOf(view.name!.toString())
      index > -1 && this.getCachedViews.splice(index, 1)
    },

    DEL_OTHERS_VISITED_VIEWS(view: ITagView) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v.meta!.affix || v.path === view.path
      })
    },

    DEL_OTHERS_CACHED_VIEWS(view: ITagView) {
      if (view.name === null) return
      const index = this.cachedViews.indexOf(view.name!.toString())
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1)
      } else {
        // if index = -1, there is no cached tags
        this.cachedViews = []
      }
    },

    DEL_ALL_VISITED_VIEWS() {
      // keep affix tags
      const affixTags = this.getVisitedViews.filter((tag) => tag.meta!.affix)
      this.visitedViews = affixTags
    },

    DEL_ALL_CACHED_VIEWS() {
      this.cachedViews = []
    },

    UPDATE_VISITED_VIEW(view: ITagView) {
      for (let v of this.getVisitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },

    addView(view: ITagView) {
      this.ADD_VISITED_VIEW(view)
      this.ADD_CACHED_VIEW(view)
    },

    addVisitedView(view: ITagView) {
      this.ADD_VISITED_VIEW(view)
    },

    delView(view: ITagView) {
      this.DEL_VISITED_VIEW(view)
      this.DEL_CACHED_VIEW(view)
    },

    delCachedView(view: ITagView) {
      this.DEL_CACHED_VIEW(view)
    },

    delOthersViews(view: ITagView) {
      this.DEL_OTHERS_VISITED_VIEWS(view)
      this.DEL_OTHERS_CACHED_VIEWS(view)
    },

    delAllViews() {
      this.DEL_ALL_VISITED_VIEWS()
      this.DEL_ALL_CACHED_VIEWS()
    },

    delAllCachedViews() {
      this.DEL_ALL_CACHED_VIEWS()
    },

    updateVisitedView(view: ITagView) {
      this.UPDATE_VISITED_VIEW(view)
    }
  }
})
