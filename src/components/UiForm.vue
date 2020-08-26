<template>
  <form
    :class="{
      'ui-form': true,
      'ui-form--inline': inline,
    }"
  >
    <slot />
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'UiForm',
  provide() {
    return {
      formSize: this.size,
      formDisabled: this.disabled,
      labelProps: {
        position: this.labelPosition,
        width: this.labelWidth,
        asterisk: this.requiredAsterisk,
      },

      formValidators: this.registerValidator,
      formValidateOn: this.validateOn,
      gutter: this.gutter,
    };
  },

  props: {
    inline: {
      type: Boolean,
      default: false,
    },

    gutter: {
      type: String,
      default: 'normal',
    },

    labelPosition: {
      type: String,
      default: 'top',
    },

    labelWidth: {
      type: String,
      default: 'auto',
    },

    requiredAsterisk: {
      type: Boolean,
      default: true,
    },

    size: {
      type: String,
      default: 'normal',
      validator: (val: string) => ['large', 'normal', 'small'].indexOf(val) !== -1,
    },

    validateOn: {
      type: String,
      default: 'submit',
      validator: (val: string) => ['submit', 'blur', 'input', 'change'].indexOf(val) !== -1,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const validators = ref(new Set<Function>());
    const registerValidator = (validator: Function) => validators.value.add(validator);
    const validate = () => {
      let valid = true;
      validators.value.forEach(fn => {
        if (!fn()) {
          valid = false;
        }
      });

      return valid;
    };

    return {
      validators,
      registerValidator,
      validate,
    };
  },
});
</script>
