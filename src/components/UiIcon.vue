<template v-if="iconComponent">
  <svg
    :class="{
      'ui-icon': true,
      [`ui-icon--${size}`]: true,
      [`ui-icon--${color}`]: color !== null,
    }"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    :aria-labelledby="icon"
    role="presentation"
  >
    <title
      :id="icon"
      lang="es"
    >
      {{ description }}
    </title>
    <g :fill="fill">
      <component :is="iconComponent" />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import icons from '@/components/icons/icons';
import { UiIcons } from '@/interfaces/Icons';

export default defineComponent({
  name: 'UiIcon',
  props: {
    viewBox: {
      type: String,
      default: '0 0 512 512',
    },

    icon: {
      type: String,
      default: 'icon',
    },

    color: {
      type: String,
      default: null,
    },

    fill: {
      type: String,
      default: 'currentColor',
    },

    size: {
      type: String,
      default: 'normal',
    },

    description: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const iconComponent = computed(() => (icons as UiIcons)[props.icon]);
    return { iconComponent };
  },
});
</script>
