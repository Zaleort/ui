<template>
  <div v-show="active">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';

export default defineComponent({
  name: 'UiTabsPanel',
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const activeName = inject('activeName');

    return {
      activeName,
    };
  },

  computed: {
    active(): boolean {
      return this.activeName === this.name;
    },
  },
});
</script>
