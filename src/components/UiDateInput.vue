<template>
  <ui-input
    :id="id"
    ref="input"
    v-model:value="formattedValue"
    :type="inline ? 'hidden' : 'text'"
    :name="name"
    :open-date="openDate"
    :placeholder="placeholder"
    :clear-button="clearable"
    :disabled="disabled"
    :required="required"
    :readonly="readonly"
    :color="color"
    :size="size"
    autocomplete="off"
    @keyup="parseTypedDate"
    @blur="handleBlur"
  >
    <template #prepend>
      <slot name="prepend" />
      <ui-icon icon="calendar" />
    </template>

    <template #append>
      <slot name="append" />
      <ui-icon
        v-if="clearable"
        v-show="value !== null"
        icon="timesCircle"
        class="clickable"
        @click.stop="clearDate()"
      />
    </template>
  </ui-input>
</template>
<script lang="ts">
import {
  computed, defineComponent, ref, watch,
} from 'vue';
import { makeDateUtils } from '@/lib/date';

export default defineComponent({
  name: 'UiDateInput',
  props: {
    selectedDate: {
      type: Date,
      default: null,
    },

    resetTypedDate: {
      type: Date,
      default: null,
    },

    format: {
      type: [String, Function],
      default: 'dd/MM/yyyy',
    },

    translation: {
      type: Object,
      default: null,
    },

    inline: {
      type: Boolean,
      default: false,
    },

    id: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    placeholder: {
      type: String,
      default: 'Selecciona una fecha',
    },

    size: {
      type: String,
      default: null,
    },

    color: {
      type: String,
      default: null,
    },

    openDate: Date,
    clearable: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    required: {
      type: Boolean,
      default: false,
    },

    readonly: {
      type: Boolean,
      default: false,
    },

    useUtc: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close-calendar', 'show-calendar', 'clear-date', 'typed-date'],

  setup(props, context) {
    const dateUtils = makeDateUtils(props.useUtc);
    const typedDate = ref<boolean | string>(false);
    const input = ref<HTMLInputElement | null>(null);

    const formattedValue = computed(() => {
      if (!props.selectedDate) {
        return null;
      }
      if (typedDate.value) {
        return typedDate.value;
      }
      return typeof props.format === 'function'
        ? props.format(props.selectedDate)
        : dateUtils.formatDate(new Date(props.selectedDate), props.format, props.translation);
    });

    const parseTypedDate = (event: KeyboardEvent) => {
      if (!input.value) return;

      if ([
        'Enter',
        'Esc',
        'Escape',
      ].includes(event.key)) {
        input.value.blur();
      }
      if (!props.readonly) {
        const date = Date.parse(input.value.value);
        if (!isNaN(date)) {
          typedDate.value = input.value.value;
          context.emit('typed-date', new Date(typedDate.value));
        }
      }
    };

    const clearDate = () => {
      context.emit('clear-date');
    };

    const handleBlur = () => {
      if (!input.value) return;

      if (props.readonly && isNaN(Date.parse(input.value.value))) {
        clearDate();
        input.value = null;
        typedDate.value = false;
      }
    };

    watch(() => props.resetTypedDate, () => typedDate.value = false);

    return {
      dateUtils,
      typedDate,
      formattedValue,
      parseTypedDate,
      handleBlur,
      clearDate,
    };
  },
});
</script>
