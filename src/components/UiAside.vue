<template>
  <aside class="ui-aside" :style="{ width }">
    <slot />
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiAside',
  props: {
    width: {
      type: String,
      default: null,
    },
  },
});
</script>
