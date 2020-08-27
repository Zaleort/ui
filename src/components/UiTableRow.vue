<template>
  <tr class="ui-table__row">
    <slot />
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiTableRow',
});
</script>
