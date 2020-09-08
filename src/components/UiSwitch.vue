<template>
  <label
    :id="id"
    class="ui-switch"
    :class="{
      'is-disabled': disabled,
      'is-bordered': border,
      'is-checked': checked,
    }"
  >
    <span
      class="ui-switch__input"
      :class="{
        'is-disabled': disabled,
        'is-checked': checked,
        'is-focus': focus
      }"
    >
      <input
        v-model="checkValue"
        class="ui-switch__original"
        type="checkbox"
        :disabled="disabled"
        :value="label"
        :name="name"
        @focus="focus = true"
        @blur="focus = false"
      >
    </span>
    <span v-if="hasLabel" class="ui-switch__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import useFormInject from '@/composables/formInject';

export default defineComponent({
  name: 'UiSwitch',
  props: {
    id: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    checked: {
      type: Boolean,
      default: false,
    },

    border: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: null,
    },
  },

  emits: ['update:checked'],

  setup(props, context) {
    const focus = ref(false);
    const checkValue = computed({
      get: () => props.checked,
      set: (check: boolean) => context.emit('update:checked', check),
    });

    const { formDisabled } = useFormInject();
    const isDisabled = computed(() => props.disabled || formDisabled);

    const hasLabel = computed(() => !!props.label || !!context.slots.default);

    return {
      focus,
      checkValue,
      hasLabel,
      isDisabled,
    };
  },
});
</script>
