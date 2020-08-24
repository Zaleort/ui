<template>
  <svg
    class="ui-icon"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
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
    <g :fill="color">
      <component :is="iconComponent" />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
/* @ts-ignore */
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

    width: {
      type: [Number, String],
      default: 16,
    },

    height: {
      type: [Number, String],
      default: '100%',
    },

    color: {
      type: String,
      default: 'currentColor',
    },

    description: {
      type: String,
      default: '',
    },
  },

  computed: {
    iconComponent(): Function {
      return (icons as UiIcons)[this.icon];
    },
  },
});
</script>
