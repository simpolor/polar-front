declare module '@toast-ui/editor' {
  export interface EditorOptions {
    el: HTMLElement
    height?: string
    initialEditType?: 'markdown' | 'wysiwyg'
    previewStyle?: 'tab' | 'vertical'
    initialValue?: string
    placeholder?: string
    hooks?: {
      addImageBlobHook?: (blob: Blob | File, callback: (url: string, altText: string) => void) => void
    }
    events?: {
      change?: () => void
      [key: string]: any
    }
    [key: string]: any
  }

  export default class Editor {
    constructor(options: EditorOptions)
    getMarkdown(): string
    setMarkdown(markdown: string): void
    destroy(): void
    [key: string]: any
  }
}
