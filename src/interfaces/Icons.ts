import { VNode } from 'vue';

export interface UiIcons {
  [key: string]: Function
}

export interface UiIconObject {
  name: string,
  node: VNode,
}
