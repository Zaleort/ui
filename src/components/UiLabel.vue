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
import { defineComponent, inject } from 'vue';

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

  setup() {
    const formLabelProps = inject('labelProps', { position: null, width: null, asterisk: false });

    return {
      formLabelProps,
    };
  },

  computed: {
    labelWidth(): string {
      return this.width || this.formLabelProps.width || 'auto';
    },

    labelPosition(): string | null {
      console.log(this.position);
      console.log(this.formLabelProps.position);
      return this.position || this.formLabelProps.position;
    },
  },
});
</script>
