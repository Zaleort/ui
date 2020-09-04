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
    const activeName = inject<any>('activeName');
    const active = computed(() => props.name === activeName.value);

    return {
      active,
      activeName,
    };
  },
});
</script>
