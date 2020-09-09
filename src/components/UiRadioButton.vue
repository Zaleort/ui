<template>
  <label
    :class="{
      'ui-radio-button': true,
      [`ui-radio-button--${radioSize}`]: radioSize,
      [`ui-radio-button--${radioColor}`]: true,
      [`is-checked--${radioColor}`]: model === label,
      'is-disabled': isDisabled,
      'is-focus': focus,
    }"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <input
      ref="radio"
      v-model="model"
      class="ui-radio-button__original"
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
    <span class="ui-radio-button__label" @keydown.stop>
      <slot />
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import useGroupInject from '@/composables/groupInject';
import useFormInject from '@/composables/formInject';

export default defineComponent({
  name: 'UiRadioButton',
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

    color: {
      type: String,
      default: null,
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

    const {
      groupValue,
      groupUpdateValue,
      groupHandleChange,
      groupSize,
      groupDisabled,
      groupColor,
      isRadioGroup,
    } = useGroupInject();

    if (!isRadioGroup) {
      console.warn('RadioButton debe usarse en un RadioGroup');
    }

    const {
      formDisabled,
      formSize,
    } = useFormInject();

    const model = computed({
      get: () => (groupValue?.value),
      set: (val) => {
        if (typeof groupUpdateValue === 'function') {
          groupUpdateValue(val);
        }

        if (radio.value) {
          radio.value.checked = model.value === props.label;
        }
      },
    });

    const radioSize = computed(() => props.size || groupSize?.value || formSize || 'normal');
    const radioColor = computed(() => props.color || groupColor || 'primary');
    const isDisabled = computed(() => props.disabled || groupDisabled?.value || formDisabled);
    const tabIndex = computed(() => ((isDisabled.value || (isRadioGroup && model.value !== props.label)) ? -1 : 0));

    const handleChange = () => {
      context.emit('change', model.value);
      if (isRadioGroup) {
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
      groupColor,
      isRadioGroup,
      model,
      radioSize,
      radioColor,
      isDisabled,
      tabIndex,
      handleChange,
      formDisabled,
      formSize,
    };
  },
});
</script>
