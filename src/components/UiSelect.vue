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
import {
  defineComponent, computed, ref, reactive, watch, onMounted,
} from 'vue';
import useFormInject from '@/composables/formInject';

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

  setup(props, context) {
    const inputValue = ref('');
    const currentPlaceholder = ref(props.placeholder);
    const cachedCurrentPlaceholder = ref('');
    const options = reactive<UiSelectOption[]>([]);
    let selected = props.multiple ? reactive<UiSelectOption[]>([]) : reactive<UiSelectOption | any>({});
    const filteredOptionsCount = ref(0);
    const visible = ref(false);
    const {
      formDisabled,
      formSize,
      formValidateOn,
      formValidators,
    } = useFormInject();

    const isDisabled = computed(() => props.disabled || formDisabled);
    const inputSize = computed(() => props.size || formSize);
    const inputValidateOn = computed(() => props.validateOn || formValidateOn);
    const hasPrepend = computed(() => !!context.slots.prepend || props.multiple);

    const emptyText = computed(() => {
      if (props.loading) {
        return 'Cargando...';
      }

      if (props.remote && inputValue.value === '' && options.length === 0) {
        return null;
      }

      if (props.filterable && inputValue.value && options.length > 0 && filteredOptionsCount.value === 0) {
        return 'Sin resultados';
      }

      if (options.length === 0) {
        return 'Sin opciones';
      }

      return null;
    });

    const showCreatedOption = computed(() => {
      const hasExistingOption = options.filter(option => !option.created)
        .some(option => option.label === inputValue.value);
      return props.filterable && props.allowCreate && inputValue.value !== '' && !hasExistingOption;
    });

    const addOption = (option: UiSelectOption) => options.push(option);
    const removeOption = (option: UiSelectOption) => {
      const i = options.findIndex(o => o.key === option.key);

      if (i >= 0) {
        options.splice(i, 1);
      }
    };

    const addSelectedValue = (val: UiSelectOption) => {
      if (props.multiple && Array.isArray(selected)) {
        selected.push(val);
        context.emit('update:value', selected.map(s => s.value));
        inputValue.value = '';
      } else {
        selected = reactive(val);
        context.emit('update:value', selected.value);
        inputValue.value = val.label;
      }
    };

    const removeSelectedValue = (val: UiSelectOption) => {
      if (props.multiple && Array.isArray(selected)) {
        const i = selected.findIndex((v: any) => v.key === val.key);
        selected.splice(i, 1);
        context.emit('update:value', selected.map(s => s.value));
      } else {
        selected = {} as UiSelectOption;
        context.emit('update:value', null);
      }

      inputValue.value = '';
    };

    const addOptionCount = () => filteredOptionsCount.value += 1;
    const substractOptionCount = () => filteredOptionsCount.value -= 1;

    const toggle = () => {
      if (!props.disabled) {
        visible.value = !visible.value;
      }
    };

    const close = () => {
      visible.value = false;
    };

    watch(visible, () => {
      if (!props.filterable) {
        return;
      }

      if (visible.value) {
        cachedCurrentPlaceholder.value = inputValue.value;
        currentPlaceholder.value = inputValue.value;
        inputValue.value = '';
        return;
      }

      if (!Array.isArray(selected)) {
        currentPlaceholder.value = props.placeholder;
        inputValue.value = selected.label;
      } else {
        currentPlaceholder.value = '';
        inputValue.value = '';
      }
    });

    const handleInput = () => {
      if (props.remote && typeof props.remoteMethod === 'function') {
        props.remoteMethod(inputValue.value);
      }

      if (typeof props.validator === 'function' && inputValidateOn.value === 'input') {
        props.validator();
      }
    };

    const handleChange = () => {
      if (props.remote && typeof props.remoteMethod === 'function') {
        props.remoteMethod(inputValue.value);
      }

      if (typeof props.validator === 'function' && inputValidateOn.value === 'change') {
        props.validator();
      }
    };

    onMounted(() => {
      filteredOptionsCount.value = options.length;

      if (!props.value) {
        return;
      }

      if (props.multiple && Array.isArray(props.value)) {
        props.value.forEach((v: any) => {
          options.forEach(o => {
            if (o.value === v || o.value[props.valueKey] === v) {
              addSelectedValue(o);
            }
          });
        });

        return;
      }

      options.some(o => {
        if (o.value === props.value || o.value[props.valueKey] === props.value) {
          addSelectedValue(o);
          return true;
        }

        return false;
      });
    });

    if (typeof formValidators === 'function' && typeof props.validator === 'function') {
      formValidators(props.validator);
    }

    return {
      visible,
      inputValue,
      currentPlaceholder,
      cachedCurrentPlaceholder,
      selected,
      options,
      isDisabled,
      inputSize,
      inputValidateOn,
      filteredOptionsCount,
      emptyText,
      hasPrepend,
      addOption,
      removeOption,
      addOptionCount,
      substractOptionCount,
      addSelectedValue,
      removeSelectedValue,
      toggle,
      close,
      showCreatedOption,
      formDisabled,
      formSize,
      formValidateOn,
      formValidators,
      handleInput,
      handleChange,
    };
  },
});
</script>
