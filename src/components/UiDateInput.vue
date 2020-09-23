<template>
  <div @click="showCalendar">
    <ui-input
      :id="id"
      :ref="refName"
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
  </div>
</template>
<script>
import { makeDateUtils } from '@/lib/date';

export default {
  name: 'UiDateInput',
  props: {
    selectedDate: Date,
    resetTypedDate: [Date],
    format: [String, Function],
    translation: {
      type: Object,
      default: null,
    },

    inline: Boolean,
    id: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    refName: {
      type: String,
      default: 'datePicker',
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
    clearable: Boolean,
    disabled: Boolean,
    required: Boolean,
    readonly: Boolean,
    useUtc: Boolean,
  },

  emits: ['close-calendar', 'show-calendar', 'clear-date', 'typed-date'],

  data() {
    const constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      input: null,
      typedDate: false,
      utils: constructedDateUtils,
    };
  },

  computed: {
    formattedValue() {
      if (!this.selectedDate) {
        return null;
      }
      if (this.typedDate) {
        return this.typedDate;
      }
      return typeof this.format === 'function'
        ? this.format(this.selectedDate)
        : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation);
    },
  },

  watch: {
    resetTypedDate() {
      this.typedDate = false;
    },
  },

  mounted() {
    this.input = this.$el.querySelector('input');
  },

  methods: {
    showCalendar() {
      console.log('show-calendar');
      this.$emit('show-calendar');
    },
    /**
     * Attempt to parse a typed date
     * @param {Event} event
     */
    parseTypedDate(event) {
      // close calendar if escape or enter are pressed
      if ([
        27, // escape
        13, // enter
      ].includes(event.keyCode)) {
        this.input.blur();
      }
      if (this.readonly) {
        const typedDate = Date.parse(this.input.value);
        if (!isNaN(typedDate)) {
          this.typedDate = this.input.value;
          this.$emit('typed-date', new Date(this.typedDate));
        }
      }
    },
    /**
     * nullify the typed date to defer to regular formatting
     * called once the input is blurred
     */
    handleBlur() {
      if (this.readonly && isNaN(Date.parse(this.input.value))) {
        this.clearDate();
        this.input.value = null;
        this.typedDate = null;
      }
      this.$emit('close-calendar');
    },
    /**
     * emit a clearDate event
     */
    clearDate() {
      this.$emit('clear-date');
    },
  },
};
</script>
