<template>
  <div class="ui-container">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiContainer',
  props: {
    maxWidth: {
      type: String,
      default: null,
    },

    direction: {
      type: String,
      default: null,
    },
  },
});
</script>
