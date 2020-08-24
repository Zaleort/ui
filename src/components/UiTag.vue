<template>
  <span
    :class="{
      'ui-tag': true,
      'ui-tag--small': size === 'small',
      'ui-tag--large': size === 'large',
      [`ui-tag--${color}`]: true,
      'is-pill': pill,
    }"
  >
    <slot />
    <ui-icon
      v-if="closable"
      class="ui-tag__close"
      icon="close"
      :width="14"
      @click="close"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiTag',
  props: {
    plain: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'normal',
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

    pill: {
      type: Boolean,
      default: true,
    },

    closable: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  methods: {
    close() {
      this.$emit('close', true);
    },
  },
});
</script>
