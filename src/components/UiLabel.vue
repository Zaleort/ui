<template>
  <label
    :class="{
      'ui-label__container': true,
      [`ui-label__container--${labelPosition}`]: labelPosition != null,
    }"
  >
    <span
      class="ui-label ui-label--margin"
      :style="{
        width: labelWidth
      }"
    >
      <slot />
    </span>
    <slot name="content" />
  </label>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';

export default defineComponent({
  name: 'UiLabel',
  props: {
    width: {
      type: String,
      default: null,
    },

    position: {
      type: String,
      default: null,
    },
  },

  setup(props) {
    const formLabelProps = inject('labelProps', { position: null, width: null, asterisk: false });
    const labelWidth = computed(() => props.width || formLabelProps.width || 'auto');
    const labelPosition = computed(() => props.position || formLabelProps.position);

    return {
      formLabelProps,
      labelWidth,
      labelPosition,
    };
  },
});
</script>
