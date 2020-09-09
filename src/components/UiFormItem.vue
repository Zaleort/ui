<template>
  <ui-label
    :class="{
      'ui-form-item': true,
      'ui-col--grow': grow,
      [`ui-col--gutter-${gutter}`]: gutter,
      [`ui-col-${span}`]: span >= 0,
      [`ui-col-m-${m}`]: m >= 0,
      [`ui-col-ml-${ml}`]: ml >= 0,
      [`ui-col-t-${t}`]: t >= 0,
      [`ui-col-d-${d}`]: d >= 0,
      [`ui-col-dl-${dl}`]: dl >= 0,
      [`ui-col-dxl-${dxl}`]: dxl >= 0,
    }"

    :style="{
      padding: `0 ${gutter / 2}px`,
    }"

    :position="labelPosition"
    :width="labelWidth"
  >
    <slot name="label">
      {{ label }}
    </slot>

    <template #content>
      <slot />
    </template>
  </ui-label>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'UiFormItem',
  props: {
    label: {
      type: String,
      default: null,
    },

    labelPosition: {
      type: String,
      default: null,
    },

    labelWidth: {
      type: String,
      default: null,
    },

    grow: {
      type: Boolean,
      default: false,
    },

    span: {
      type: Number,
      default: undefined,
    },

    m: {
      type: Number,
      default: undefined,
    },
    ml: {
      type: Number,
      default: undefined,
    },

    t: {
      type: Number,
      default: undefined,
    },

    d: {
      type: Number,
      default: undefined,
    },

    dl: {
      type: Number,
      default: undefined,
    },

    dxl: {
      type: Number,
      default: undefined,
    },
  },

  setup() {
    const gutter = inject('gutter', 'normal');

    return {
      gutter,
    };
  },
});
</script>
