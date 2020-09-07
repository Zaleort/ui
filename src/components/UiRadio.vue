<template>
  <label
    class="ui-radio"
    :class="[
      border && radioSize ? 'ui-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span
      class="ui-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="ui-radio__inner" />
      <input
        ref="radio"
        v-model="model"
        class="ui-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
      >
    </span>
    <span class="ui-radio__label" @keydown.stop>
      <slot />
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script lang="ts">
import {
  defineComponent, ref, inject, computed, ComputedRef,
} from 'vue';
import useFormInject from '@/composables/formInject';

export default defineComponent({
  name: 'UiRadio',
  props: {
    value: {
      type: [String, Number, Object],
      default: null,
    },

    label: {
      type: String,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      default: null,
    },

    border: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: null,
    },
  },

  emits: ['update:value', 'change'],

  setup(props, context) {
    const radio = ref<HTMLInputElement | null>(null);
    const focus = ref(false);
    const groupValue = inject<ComputedRef | null>('groupValue', null);
    const groupUpdateValue = inject<Function | null>('groupUpdateValue', null);
    const groupHandleChange = inject<Function | null>('groupHandleChange', null);
    const groupSize = inject<ComputedRef | null>('groupSize', null);
    const groupDisabled = inject<ComputedRef | null>('groupDisabled', null);
    const isGroup = typeof groupUpdateValue === 'function' && typeof groupHandleChange === 'function';

    const {
      formDisabled,
      formSize,
    } = useFormInject();

    const model = computed({
      get: () => (isGroup ? groupValue?.value : props.value),
      set: (val) => {
        if (isGroup) {
          groupUpdateValue!(val);
        } else {
          context.emit('update:value', val);
        }

        if (radio.value) {
          radio.value.checked = model.value === props.label;
        }
      },
    });

    const radioSize = computed(() => props.size || groupSize?.value || formSize);
    const isDisabled = computed(() => props.disabled || groupDisabled?.value || formDisabled);
    const tabIndex = computed(() => ((isDisabled.value || (isGroup && model.value !== props.label)) ? -1 : 0));

    const handleChange = () => {
      context.emit('change', model.value);
      if (isGroup) {
        groupHandleChange!(model.value);
      }
    };

    return {
      radio,
      focus,
      groupValue,
      groupUpdateValue,
      groupDisabled,
      groupHandleChange,
      groupSize,
      isGroup,
      model,
      radioSize,
      isDisabled,
      tabIndex,
      handleChange,
      formDisabled,
      formSize,
    };
  },
});
</script>
