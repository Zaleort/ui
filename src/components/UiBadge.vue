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
import { defineComponent, computed } from 'vue';

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
    },

    display: {
      type: String,
      default: 'inline-block',
    },
  },

  setup(props) {
    const displayValue = computed(() => {
      if (props.isDot || !props.value) {
        return '';
      }

      if (props.max) {
        const val = Number.parseInt(props.value.toString(), 10);
        if (Number.isNaN(val)) return props.value;
        return val > props.max ? `${props.max}+` : val;
      }

      return props.value;
    });

    return {
      displayValue,
    };
  },
});
</script>
