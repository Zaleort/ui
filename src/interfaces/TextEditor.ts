export interface UiTextEditorOptions {
  [label: string]: UiTextEditorOption;
}

export interface UiTextEditorOption {
  icon: string;
  title: string;
  isActive?: boolean;
  state?: Function;
  result: Function;
}
