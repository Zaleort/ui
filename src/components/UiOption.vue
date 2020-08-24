<template>
  <li
    v-show="visible"
    class="ui-select-menu__option"
    :class="{
      'is-disabled': disabled,
      'is-selected': selected,
    }"
    @click="handleSelect"
  >
    <slot>{{ label }}</slot>
  </li>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiOption',
  inject: {
    addOption: 'addOption',
    removeOption: 'removeOption',
    addOptionCount: 'addOptionCount',
    substractOptionCount: 'substractOptionCount',
    addSelectedValue: 'addSelectedValue',
    removeSelectedValue: 'removeSelectedValue',
    selectValue: 'value',
    inputValue: 'inputValue',
    filterable: 'filterable',
  },

  props: {
    value: {
      type: [Number, String, Object, Array],
      default: null,
      required: true,
    },

    label: {
      type: String,
      default: null,
    },

    key: {
      type: [Number, String],
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    created: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    selected() {
      if (Array.isArray(this.selectValue.value)) {
        return this.selectValue.value.indexOf(this.value) !== -1;
      }

      return this.selectValue.value === this.value;
    },

    visible() {
      if (this.inputValue.value.length <= 0 || !this.filterable) {
        return true;
      }

      return this.label.includes(this.inputValue.value);
    },

    option() {
      return {
        value: this.value,
        label: this.label || this.value,
        key: this.key || this.value,
        created: this.created,
      };
    },
  },

  watch: {
    visible() {
      if (this.visible) {
        this.addOptionCount();
      } else {
        this.substractOptionCount();
      }
    },
  },

  created() {
    this.addOption(this.option);
  },

  beforeUnmount() {
    this.removeOption(this.option);
  },

  methods: {
    handleSelect() {
      if (this.disabled) {
        return;
      }

      if (this.selected && Array.isArray(this.selectValue.value)) {
        this.removeSelectedValue(this.option);
        return;
      }

      this.addSelectedValue(this.option);
    },
  },
});
</script>
