<template>
  <div
    v-click-outside="close"
    :class="{
      'ui-select': true,
      [`ui-select--${inputSize}`]: inputSize,
    }"
    @click.stop="toggle"
  >
    <ui-input
      v-model:value="inputValue"
      type="text"
      :disabled="isDisabled"
      :readonly="readonly || !filterable"
      :size="inputSize"
      :placeholder="currentPlaceholder"
      @input="handleInput"
      @change="handleChange"
    >
      <template v-if="hasPrepend" #prepend>
        <slot name="prepend" />
        <div v-if="multiple" class="ui-select__tags">
          <ui-tag
            v-for="item in selected"
            :key="item.key"
            :closable="!isDisabled"
            size="small"
            @close="removeSelectedValue(item)"
          >
            {{ item.label }}
          </ui-tag>
        </div>
      </template>
    </ui-input>

    <transition name="ui-select-show">
      <ul v-show="visible" class="ui-select-menu">
        <ui-option
          v-if="showCreatedOption"
          :label="inputValue"
          created
        />
        <slot />
        <template v-if="emptyText && (!allowCreate || loading || (allowCreate && options.length === 0 ))">
          <slot v-if="$slots.empty" name="empty" />
          <p v-else class="ui-select-menu__empty">
            {{ emptyText }}
          </p>
        </template>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from 'vue';

interface UiSelectOption {
  value: any;
  key: number | string;
  label: string;
  created: boolean;
}

export default defineComponent({
  name: 'UiSelect',
  // Permite a los UiOption acceder a los props, ya que al ser slots no pueden recibirlos
  // Pasando funciones por Provide permite actualizar data del Select, al no poder escuchar eventos
  provide() {
    return {
      addOption: this.addOption,
      removeOption: this.removeOption,
      addOptionCount: this.addOptionCount,
      substractOptionCount: this.substractOptionCount,
      addSelectedValue: this.addSelectedValue,
      removeSelectedValue: this.removeSelectedValue,
      value: computed(() => this.value),
      inputValue: computed(() => this.inputValue),
      filterable: this.filterable,
    };
  },

  props: {
    value: {
      type: [Number, String, Object, Array],
      default: '',
    },

    valueKey: {
      type: String,
      default: null,
    },

    placeholder: {
      type: String,
      default: 'Seleccionar',
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    clearable: {
      type: Boolean,
      default: false,
    },

    filterable: {
      type: Boolean,
      default: false,
    },

    allowCreate: {
      type: Boolean,
      default: false,
    },

    remote: {
      type: Boolean,
      default: false,
    },

    remoteMethod: {
      type: Function,
      default: null,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    readonly: {
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

  emits: ['update:value'],

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
      visible: false,
      inputValue: '',
      currentPlaceholder: this.placeholder,
      cachedCurrentPlaceholder: '',
      selected: this.multiple ? [] : {} as UiSelectOption | UiSelectOption[],
      options: [] as UiSelectOption[],
      filteredOptionsCount: 0,
    };
  },

  computed: {
    hasPrepend(): boolean {
      return !!this.$slots.prepend || this.multiple;
    },

    emptyText(): string | null {
      if (this.loading) {
        return 'Cargando...';
      }

      if (this.remote && this.inputValue === '' && this.options.length === 0) {
        return null;
      }

      if (this.filterable && this.inputValue && this.options.length > 0 && this.filteredOptionsCount === 0) {
        return 'Sin resultados';
      }

      if (this.options.length === 0) {
        return 'Sin opciones';
      }

      return null;
    },

    showCreatedOption(): boolean {
      const hasExistingOption = this.options.filter(option => !option.created)
        .some(option => option.label === this.inputValue);
      return this.filterable && this.allowCreate && this.inputValue !== '' && !hasExistingOption;
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

  watch: {
    visible() {
      if (!this.filterable) {
        return;
      }

      if (this.visible) {
        this.cachedCurrentPlaceholder = this.inputValue;
        this.currentPlaceholder = this.inputValue;
        this.inputValue = '';
        return;
      }

      if (!Array.isArray(this.selected)) {
        this.currentPlaceholder = this.placeholder;
        this.inputValue = this.selected.label;
      } else {
        this.currentPlaceholder = '';
        this.inputValue = '';
      }
    },
  },

  created() {
    if (typeof this.formValidators === 'function' && typeof this.validator === 'function') {
      this.formValidators(this.validator);
    }
  },

  mounted() {
    this.filteredOptionsCount = this.options.length;

    if (!this.value) {
      return;
    }

    if (this.multiple && Array.isArray(this.value)) {
      this.value.forEach((v: any) => {
        this.options.forEach(o => {
          if (o.value === v || o.value[this.valueKey] === v) {
            this.addSelectedValue(o);
          }
        });
      });

      return;
    }

    this.options.some(o => {
      if (o.value === this.value || o.value[this.valueKey] === this.value) {
        this.addSelectedValue(o);
        return true;
      }

      return false;
    });
  },

  methods: {
    toggle() {
      if (!this.disabled) {
        this.visible = !this.visible;
      }
    },

    close() {
      this.visible = false;
    },

    handleInput() {
      if (this.remote && typeof this.remoteMethod === 'function') {
        this.remoteMethod(this.inputValue);
      }

      if (typeof this.validator === 'function' && this.inputValidateOn === 'input') {
        this.validator();
      }
    },

    handleChange() {
      if (this.remote && typeof this.remoteMethod === 'function') {
        this.remoteMethod(this.inputValue);
      }

      if (typeof this.validator === 'function' && this.inputValidateOn === 'change') {
        this.validator();
      }
    },

    addOption(option: UiSelectOption) {
      this.options.push(option);
    },

    removeOption(option: UiSelectOption) {
      const i = this.options.findIndex(o => o.key === option.key);

      if (i >= 0) {
        this.options.splice(i, 1);
      }
    },

    addOptionCount() {
      this.filteredOptionsCount += 1;
    },

    substractOptionCount() {
      this.filteredOptionsCount -= 1;
    },

    addSelectedValue(val: UiSelectOption) {
      if (this.multiple && Array.isArray(this.selected)) {
        this.selected.push(val);
        this.$emit('update:value', this.selected.map(s => s.value));
        this.inputValue = '';
      } else {
        this.selected = val;
        this.$emit('update:value', this.selected.value);
        this.inputValue = val.label;
      }
    },

    removeSelectedValue(val: UiSelectOption) {
      if (this.multiple && Array.isArray(this.selected)) {
        const i = this.selected.findIndex((v: any) => v.key === val.key);
        this.selected.splice(i, 1);
        this.$emit('update:value', this.selected.map(s => s.value));
      } else {
        this.selected = {} as UiSelectOption;
        this.$emit('update:value', null);
      }

      this.inputValue = '';
    },
  },
});
</script>
