<template>
  <div v-click-outside="hide" class="ui-dropdown">
    <div @click="toggle">
      <slot />
    </div>

    <transition name="ui-dropdown-show">
      <ul v-show="isVisible" class="ui-dropdown-menu">
        <slot name="menu" />
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'UiDropdown',
  setup() {
    const isVisible = ref(false);
    const hide = () => isVisible.value = false;
    const toggle = () => isVisible.value = !isVisible.value;

    return {
      isVisible,
      hide,
      toggle,
    };
  },
});
</script>
