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

  setup(props) {
    const handleAction = () => {
      if (props.disabled || !props.action) return;
      props.action();
    };

    return { handleAction };
  },
});
</script>
