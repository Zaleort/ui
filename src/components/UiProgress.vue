<template>
  <div
    :class="{
      'ui-progress__container': true,
      'is-pill': pill,
      'is-loading': loading,
    }"
  >
    <div
      :class="{
        'ui-progress': true,
        [`ui-progress--${barColor}`]: true,
        [`ui-progress--${size}`]: true,
      }"
      :style="'width: ' + relativePercentage + '%;'"
    >
      <span class="ui-progress__span">{{ showPercent ? percentage + '%' : '' }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'UiProgress',
  props: {
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },

    max: {
      type: Number,
      default: 100,
    },

    danger: {
      type: Number,
      default: 33,
    },

    warning: {
      type: Number,
      default: 75,
    },

    color: {
      type: String,
      default: null,
    },

    pill: {
      type: Boolean,
      default: false,
    },

    showPercent: {
      type: Boolean,
      default: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'normal',
    },
  },

  setup(props) {
    const relativePercentage = computed(() => (props.percentage * 100) / props.max);
    const barColor = computed(() => {
      if (props.color) return props.color;
      if (relativePercentage.value < props.danger) return 'danger';
      if (relativePercentage.value < props.warning) return 'warning';
      return 'success';
    });

    return {
      relativePercentage,
      barColor,
    };
  },
});
</script>
