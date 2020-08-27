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
            'is-fixed': fixedHead,
          }"
          :style="{
            width: h.width + 'px',
            textAlign: h.align,
          }"
        >
          {{ h.name }}
          <div v-if="h.sortable" class="ui-table__order">
            <ui-icon
              icon="chevronUp"
              size="small"
              @click="order(h, 'ascendent')"
            />
            <ui-icon
              icon="chevronDown"
              size="small"
              @click="order(h, 'descendent')"
            />
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
import { defineComponent, PropType, provide } from 'vue';
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

    loading: {
      type: Boolean,
      default: false,
    },

    fixedHead: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['sort'],

  setup(props, context) {
    provide('tableSize', props.size);
    const order = (item: UiTableHeading, direction: string) => {
      if (typeof props.sortMethod === 'function') {
        context.emit('sort', props.sortMethod(item.prop, direction));
      }
    };

    return {
      order,
    };
  },
});
</script>
