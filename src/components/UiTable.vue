<template>
  <table
    :class="{
      'ui-table': true,
    }"
  >
    <th v-for="(h, index) of headings" :key="index">
      {{ h.name }}
      <div class="ui-table__order">
        <ui-icon icon="chevronUp" size="small" />
        <ui-icon icon="chevronDown" size="small" />
      </div>
    </th>

    <slot />
  </table>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiTable',
  props: {
    headings: {
      type: Array,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    sortMethod: {
      type: Function,
      default: null,
    },
  },
});
</script>
