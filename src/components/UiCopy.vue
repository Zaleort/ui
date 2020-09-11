<template>
  <div
    v-if="mode === 'wrapper'"
    :class="{
      'ui-copy': true,
    }"

    @click="copy"
  >
    <slot />
  </div>

  <ui-icon
    v-else
    :icon="copyIcon"
    :size="size"
    @click="copy"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, Ref } from 'vue';

export default defineComponent({
  name: 'UiCopy',
  props: {
    mode: {
      type: String,
      default: 'icon',
      validator: (val: string) => ['icon', 'wrapper'].indexOf(val) !== -1,
    },

    value: {
      type: [String, Number, Object] as PropType<string | number | Ref<HTMLTextAreaElement> | Ref<HTMLInputElement>>,
      required: true,
    },

    size: {
      type: String,
      default: 'normal',
    },

    copyIcon: {
      type: String,
      default: 'copy',
    },
  },

  emits: ['copy'],

  setup(props, context) {
    let el: HTMLTextAreaElement;

    const copy = () => {
      if (typeof props.value === 'object') {
        props.value.value.select();
      } else {
        el = document.createElement('textarea');
        el.value = props.value.toString();
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
      }

      const res = document.execCommand('copy');
      document.body.removeChild(el);

      context.emit('copy', res ? props.value : null);
    };

    return {
      copy,
    };
  },
});
</script>
