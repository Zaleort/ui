<template>
  <button
    :class="{
      'ui-button': true,
      'ui-button--small': buttonSize === 'small',
      'ui-button--large': buttonSize === 'large',
      [`ui-button--${color}`]: true,
      'is-pill': pill,
      'is-loading': loading,
    }"
    :disabled="isDisabled"
    :type="type"
  >
    <ui-icon
      v-if="loading"
      class="ui-icon-loading"
      icon="loading"
      width="14"
    />
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'UiButton',
  props: {
    type: {
      type: String,
      default: 'button',
    },

    plain: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: null,
      validator: (value: string) => ['large', 'normal', 'small'].indexOf(value) !== -1,
    },

    color: {
      type: String,
      default: 'primary',
      validator: (value: string) => {
        const colores = [
          'primary',
          'secondary',
          'success',
          'warning',
          'danger',
          'info',
          'grey',
        ];

        return colores.indexOf(value) !== -1;
      },
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    pill: {
      type: Boolean,
      default: false,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const formDisabled = inject('formDisabled', false);
    const formSize = inject('formSize', null);

    return {
      formDisabled,
      formSize,
    };
  },

  computed: {
    isDisabled(): boolean {
      return this.loading || this.disabled || this.formDisabled;
    },

    buttonSize(): string {
      return this.size || this.formSize || 'normal';
    },
  },
});
</script>
