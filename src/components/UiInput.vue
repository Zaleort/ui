<template>
  <div
    :class="{
      'ui-input': type !== 'textarea',
      'ui-textarea': type === 'textarea',
      'is-focus': focus,
      'is-disabled': isDisabled,
      'is-readonly': readonly,
    }"
  >
    <div v-if="hasPrepend" class="ui-input__prepend">
      <slot name="prepend" />
    </div>
    <input
      v-if="type !== 'textarea'"
      v-model="inputValue"
      v-bind="$attrs"
      :type="type"
      :disabled="isDisabled"
      :readonly="readonly"
      :class="{
        'ui-input__inner': true,
        'ui-input__inner--small': inputSize === 'small',
        'ui-input__inner--large': inputSize === 'large',
        'is-disabled': isDisabled,
        'is-readonly': readonly,
      }"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >

    <textarea
      v-else
      v-model="inputValue"
      v-bind="$attrs"
      :disabled="isDisabled"
      :readonly="readonly"
      :class="{
        'ui-textarea__inner': true,
        'ui-textarea__inner--small': inputSize === 'small',
        'ui-textarea__inner--large': inputSize === 'large',
        'is-fixed': fixed,
        'is-disabled': isDisabled,
        'is-readonly': readonly,
      }"
      @input="$emit('input', $event)"
      @focus="setFocus(true)"
      @blur="setFocus(false)"
    />
    <div v-if="hasAppend" class="ui-input__append">
      <slot name="append" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'UiInput',
  props: {
    value: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      default: 'text',
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    readonly: {
      type: Boolean,
      default: false,
    },

    fixed: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: null,
      validator: (value: string) => ['large', 'normal', 'small'].indexOf(value) !== -1,
    },

    validator: {
      type: Function,
      default: null,
    },

    validateOn: {
      type: String,
      default: 'submit',
    },
  },

  emits: ['update:value', 'input', 'change'],

  setup() {
    const formDisabled = inject('formDisabled', false);
    const formSize = inject('formSize', null);
    const formValidators = inject('formValidators');
    const formValidateOn = inject('formValidateOn', 'submit');

    return {
      formDisabled,
      formSize,
      formValidators,
      formValidateOn,
    };
  },

  data() {
    return {
      focus: false,
    };
  },

  computed: {
    inputValue: {
      get(): string {
        return this.value;
      },

      set(val: string) {
        this.$emit('update:value', val);
      },
    },

    hasPrepend(): boolean {
      return !!this.$slots.prepend;
    },

    hasAppend(): boolean {
      return !!this.$slots.append;
    },

    isDisabled(): boolean {
      return this.disabled || this.formDisabled;
    },

    inputSize(): string {
      return this.size || this.formSize || 'normal';
    },

    inputValidateOn(): string {
      return this.validateOn || this.formValidateOn;
    },
  },

  created() {
    if (typeof this.formValidators === 'function' && typeof this.validator === 'function') {
      this.formValidators(this.validator);
    }
  },

  methods: {
    setFocus(set: boolean) {
      this.focus = set;
    },

    handleInput(e: InputEvent) {
      this.$emit('input', e);

      if (typeof this.validator === 'function' && this.validateOn === 'input') {
        this.validator();
      }
    },

    handleChange(e: Event) {
      this.$emit('change', e);

      if (typeof this.validator === 'function' && this.validateOn === 'change') {
        this.validator();
      }
    },

    handleFocus() {
      this.setFocus(true);
    },

    handleBlur() {
      this.setFocus(false);

      if (typeof this.validator === 'function' && this.validateOn === 'blur') {
        this.validator();
      }
    },
  },
});
</script>
