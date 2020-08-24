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
        @change="handleChange"
      >
    </span>
    <span v-if="hasLabel" class="ui-switch__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
  },

  methods: {
    handleChange() {
      console.log(this.checked);
    },
  },
});
</script>
