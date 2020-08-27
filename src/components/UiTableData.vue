<template>
  <td
    class="ui-table__data"
    :style="{
      textAlign: align,
    }"
  >
    <slot />
  </td>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiTableData',
  props: {
    align: {
      type: String,
      default: null,
    },
  },
});
</script>
