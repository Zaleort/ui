export interface UiTableHeading {
  name: string;
  prop: string;
  sortable: boolean;
  icon: string;
  width: string;
  align: string;
}

export type UiTableSortMethod = (prop: string, direction: string) => any;
