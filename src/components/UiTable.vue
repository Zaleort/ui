<template>
  <div class="ui-table__wrapper">
    <table
      :class="{
        'ui-table': true,
        [`ui-table--${size}`]: true,
        'ui-table--stripe': stripe,
      }"
    >
      <thead>
        <th
          v-for="(h, index) of headings"
          :key="index"
          :class="{
            'ui-table__heading': true,
            [`ui-table__heading--${size}`]: true,
            'clickable': h.sortable,
          }"
          :style="{
            width: h.width + 'px',
            textAlign: h.align,
          }"
          @click="h.sortable ? direction = null : null"
        >
          <div class="ui-table__heading-cell">
            {{ h.name }}
            <div v-if="h.sortable" class="ui-table__order">
              <ui-icon
                icon="chevronUp"
                size="mini"
                class="clickable ml-2"
                :class="{ 'text-primary': direction === 'ascendent' }"
                @click.stop="order(h, 'ascendent')"
              />
              <ui-icon
                icon="chevronDown"
                size="mini"
                class="clickable ml-2"
                :class="{ 'text-primary': direction === 'descendent' }"
                @click.stop="order(h, 'descendent')"
              />
            </div>
          </div>
        </th>
      </thead>
      <tbody class="ui-table__body">
        <slot />
      </tbody>
    </table>

    <span v-if="emptyText && (!items || items.length === 0)" class="ui-table__empty-text">
      {{ emptyText }}
    </span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, provide, ref,
} from 'vue';
import { UiTableHeading, UiTableSortMethod } from '@/interfaces/Table';

export default defineComponent({
  name: 'UiTable',
  props: {
    headings: {
      type: Array as PropType<UiTableHeading[]>,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    sortMethod: {
      type: Function as PropType<UiTableSortMethod>,
      default: null,
    },

    size: {
      type: String,
      default: 'normal',
    },

    stripe: {
      type: Boolean,
      default: false,
    },

    emptyText: {
      type: String,
      default: null,
    },
  },

  emits: ['sort'],

  setup(props, context) {
    provide('tableSize', props.size);
    const direction = ref<string | null>(null);
    const order = (item: UiTableHeading, _direction: string) => {
      direction.value = _direction;
      if (typeof props.sortMethod === 'function') {
        context.emit('sort', props.sortMethod(item.prop, _direction));
      }
    };

    return {
      direction,
      order,
    };
  },
});
</script>
