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
  defineComponent, ref, inject, computed,
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
    const groupValue = inject<any | null>('groupValue', null);
    const groupUpdateValue = inject<Function>('groupUpdateValue', () => {});
    const groupHandleChange = inject<Function>('groupHandleChange', () => {});
    const groupSize = inject<string | null>('groupSize', null);
    const groupDisabled = inject('groupDisabled', false);
    const isGroup = false;

    const {
      formDisabled,
      formSize,
    } = useFormInject();

    const model = computed({
      get: () => (isGroup ? groupValue : props.value),
      set: (val) => {
        if (isGroup) {
          groupUpdateValue(val);
        } else {
          context.emit('update:value', val);
        }

        if (radio.value) {
          radio.value.checked = model.value === props.label;
        }
      },
    });

    const radioSize = computed(() => props.size || groupSize || formSize);
    const isDisabled = computed(() => props.disabled || groupDisabled || formDisabled);
    const tabIndex = computed(() => ((isDisabled.value || (isGroup && model.value !== props.label)) ? -1 : 0));

    const handleChange = () => {
      context.emit('change', model.value);
      if (isGroup) {
        groupHandleChange(model.value);
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
