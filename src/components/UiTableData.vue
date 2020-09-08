<template>
  <td
    :class="{
      'ui-table__data': true,
      [`ui-table__data--${tableSize}`]: true,
    }"
    :style="{
      textAlign: align,
    }"
  >
    <slot />
  </td>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'UiTableData',
  props: {
    align: {
      type: String,
      default: null,
    },
  },

  setup() {
    const tableSize = inject('tableSize', 'normal');

    return {
      tableSize,
    };
  },
});
</script>
