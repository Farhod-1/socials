import type { Component, InjectionKey, MaybeRef, Ref, UnwrapNestedRefs } from 'vue'

export type ContextMenuAction = () => boolean | void | Promise<void> | Promise<boolean>

export interface IContextMenuItem {
  title: string
  icon?: string | Component | unknown
  action?: ContextMenuAction
  submenu?: IContextMenuItem[]
}

export type ContextMenuCreator = (data?: ContextMenuConstructor) => void
export const ContextMenuKey = Symbol('ContextMenu') as InjectionKey<ContextMenuCreator>

export interface ContextMenuConstructor {
  anchor?: Ref<HTMLElement | undefined>
  hide?: boolean
  title?: string
  event: MouseEvent
  items: MaybeRef<IContextMenuItem[]>
}

export type ContextMenuProps = UnwrapNestedRefs<ContextMenuConstructor>
