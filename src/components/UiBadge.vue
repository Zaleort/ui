<template>
  <div class="ui-badge__parent" :style="{ display }">
    <span
      v-show="value"
      class="ui-badge"
      :class="{
        'ui-badge--dot': isDot,
        [`ui-badge--${color}`]: true,
      }"
    >
      {{ displayValue }}
    </span>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiBadge',
  props: {
    isDot: {
      type: Boolean,
      default: false,
    },

    value: {
      type: [String, Number],
      default: null,
    },

    max: {
      type: Number,
      default: null,
    },

    color: {
      type: String,
      default: 'danger',
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

    display: {
      type: String,
      default: 'inline-block',
    },
  },

  computed: {
    displayValue(): string | number {
      if (this.isDot || !this.value) {
        return '';
      }

      if (this.max) {
        const val = Number.parseInt(this.value.toString(), 10);
        if (Number.isNaN(val)) return this.value;
        return val > this.max ? `${this.max}+` : val;
      }

      return this.value;
    },
  },
});
</script>
