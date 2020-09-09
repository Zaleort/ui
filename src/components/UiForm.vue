<template>
  <form
    :class="{
      'ui-form': true,
      'ui-form--inline': inline,
    }"
  >
    <div v-if="errors.size > 0" class="ui-form__errors">
      <ui-icon icon="error" size="x2" />
      <div>
        <span
          v-for="(error, index) of errors"
          :key="index"
          class="ui-form__error"
        >{{ error }}</span>
      </div>
    </div>
    <slot />
  </form>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue';

export default defineComponent({
  name: 'UiForm',
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

  setup(props) {
    const validators = ref<Function[]>([]);
    const registerValidator = (validator: Function) => validators.value.push(validator);
    const errors = ref(new Set<string>());
    const validate = () => {
      errors.value.clear();
      validators.value.forEach(fn => {
        const res = fn();
        if (res !== null) {
          errors.value.add(res);
        }
      });

      return errors.value.size === 0;
    };

    provide('formSize', props.size);
    provide('formDisabled', props.disabled);
    provide('labelProps', {
      position: props.labelPosition,
      width: props.labelWidth,
      asterisk: props.requiredAsterisk,
    });

    provide('formValidators', registerValidator);
    provide('formValidateOn', props.validateOn);
    provide('gutter', props.gutter);

    return {
      validators,
      errors,
      registerValidator,
      validate,
    };
  },
});
</script>
