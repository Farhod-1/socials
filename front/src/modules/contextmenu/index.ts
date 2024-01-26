import type { App } from 'vue'
import { createApp, inject, reactive, toValue } from 'vue'
import ContextMenu from './ContextMenu.vue'
import type { ContextMenuConstructor, ContextMenuCreator, ContextMenuProps } from './types'
import { ContextMenuKey } from './types'

export function useContextMenu() {
  const contextMenu = inject(ContextMenuKey) as ContextMenuCreator

  if (!contextMenu) {
    throw new Error('No context menu provided')
  }

  return {
    showContextMenu: contextMenu
  }
}

export default {
  install: (app: App) => {
    const contextMenuConstructor: ContextMenuProps = reactive({
      hide: true
    } as ContextMenuConstructor)

    function SetContextMenu(data: ContextMenuConstructor) {
      if (data) {
        contextMenuConstructor.hide = false
        contextMenuConstructor.anchor = toValue(data.anchor)
        contextMenuConstructor.items = toValue(data.items)
        contextMenuConstructor.event = data.event
        contextMenuConstructor.title = data.title
      } else {
        contextMenuConstructor.hide = true
      }
    }

    const contextMenuRoot = document.createElement('div')
    document.body.append(contextMenuRoot)

    const contextMenuApp = createApp(ContextMenu, { menu: contextMenuConstructor })

    app.provide(ContextMenuKey, SetContextMenu)
    contextMenuApp.provide(ContextMenuKey, SetContextMenu)

    contextMenuApp.mount(contextMenuRoot)
  }
}
