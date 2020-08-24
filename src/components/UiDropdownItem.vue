<template>
  <li
    class="ui-dropdown-menu__item"
    :class="{
      'is-disabled': disabled,
    }"
    @click="handleAction"
  >
    <slot />
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiDropdownItem',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

    action: {
      type: Function,
      default: null,
    },
  },

  methods: {
    handleAction() {
      if (this.disabled || !this.action) {
        return;
      }

      this.action();
    },
  },
});
</script>
