<template>
  <div
    :class="{
      'ui-avatar': true,
      'ui-avatar--circle': circle,
      [`ui-avatar--${size}`]: true,
    }"
  >
    <img :src="src" :alt="alt">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiAvatar',
  props: {
    src: {
      type: String,
      default: null,
    },

    alt: {
      type: String,
      default: 'avatar',
    },

    circle: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'normal',
    },
  },
});
</script>
