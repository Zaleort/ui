<template>
  <div
    class="ui-radio-group"
    role="radiogroup"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide } from 'vue';
import useInjectForm from '@/composables/formInject';

export default defineComponent({
  name: 'UiRadioGroup',
  props: {
    value: {
      type: [String, Number, Object, Array],
      default: null,
    },

    size: {
      type: String,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:value', 'change'],

  setup(props, context) {
    const {
      formSize,
      formDisabled,
    } = useInjectForm();

    const groupSize = computed(() => props.size || formSize || 'normal');
    const groupDisabled = computed(() => props.disabled || formDisabled);
    const groupUpdateValue = (val: any) => {
      context.emit('update:value', val);
    };

    const groupHandleChange = (val: any) => {
      context.emit('change', val);
    };

    provide('groupValue', computed(() => props.value));
    provide('groupSize', groupSize);
    provide('groupDisabled', groupDisabled);
    provide('groupUpdateValue', groupUpdateValue);
    provide('groupHandleChange', groupHandleChange);

    return {
      formSize,
      formDisabled,
      groupSize,
      groupDisabled,
      groupUpdateValue,
      groupHandleChange,
    };
  },
});
</script>
