<template>
  <table
    :class="{
      'ui-table': true,
      [`ui-table--${size}`]: true,
    }"
  >
    <tr>
      <th
        v-for="(h, index) of headings"
        :key="index"
        class="ui-table__heading"
        :style="{
          width: h.width,
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
    </tr>
    <slot />
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
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
  },

  emits: ['sort'],

  setup(props, context) {
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
