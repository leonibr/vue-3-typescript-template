declare module 'path-browserify' {
  export * from 'path'
  import path = require('path')
  export default path
}

declare module 'sortablejs' {
  export interface SortableEvent {
    oldIndex?: number
    newIndex?: number
  }

  export interface SortableOptions {
    ghostClass?: string
    onEnd?: (evt: SortableEvent) => void
  }

  export default class Sortable {
    static create(el: HTMLElement, options?: SortableOptions): Sortable
    destroy(): void
  }
}

declare module 'vue-countup-v3' {
  import type { DefineComponent } from 'vue'

  const CountUp: DefineComponent<Record<string, never>, {}, any>
  export default CountUp
}

declare module 'splitpanes' {
  import type { DefineComponent } from 'vue'

  export const Splitpanes: DefineComponent<Record<string, never>, {}, any>
  export const Pane: DefineComponent<Record<string, never>, {}, any>
}

declare module 'vue-image-crop-upload' {
  import type { DefineComponent } from 'vue'

  const ImageCropUpload: DefineComponent<Record<string, never>, {}, any>
  export default ImageCropUpload
}

declare module '@toast-ui/editor' {
  export type EditorOptions = Record<string, unknown>

  export default class Editor {
    constructor(options?: EditorOptions)
    changeMode(value: string): void
    destroy(): void
    height(value: string): void
    insertText(value: string): void
    focus(): void
    setHtml(value: string): void
    getHtml(): string
  }
}

declare module '@toast-ui/editor/dist/i18n/*'
