<template>
  <label
    :id="id"
    class="ui-checkbox"
    :class="{
      'is-disabled': isDisabled,
      'is-bordered': border,
      'is-checked': checked,
    }"
  >
    <span
      class="ui-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': checked,
        'is-focus': focus
      }"
    >
      <input
        v-model="checkValue"
        class="ui-checkbox__original"
        type="checkbox"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
      >
    </span>
    <span v-if="hasLabel" class="ui-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'UiCheckbox',
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
    checkValue: {
      get(): boolean {
        return this.checked;
      },

      set(check: boolean) {
        this.$emit('update:checked', check);
      },
    },

    hasLabel(): boolean {
      if (this.label || this.$slots.default) {
        return true;
      }

      return false;
    },

    isDisabled(): boolean {
      return this.disabled || this.formDisabled;
    },
  },

  methods: {
    handleChange() {
      console.log(this.checked);
    },
  },
});
</script>
