<template>
  <div class="ui-date">
    <ui-date-input
      :id="id"
      :selected-date="selectedDate"
      :reset-typed-date="resetTypedDate"
      :format="format"
      :translation="language"
      :name="name"
      :ref-name="refName"
      :open-date="openDate"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :required="required"
      :use-utc="useUtc"
      :color="color"
      :size="size"
      @show-calendar="showCalendar"
      @close-calendar="close"
      @typed-date="setTypedDate"
      @clear-date="clearDate"
    />

    <!-- Day View -->
    <ui-date-day
      v-if="allowedToShowView('day')"
      :page-date="pageDate"
      :selected-date="selectedDate"
      :show-day-view="showDayView"
      :full-month-name="fullMonthName"
      :allowed-to-show-view="allowedToShowView"
      :disabled-dates="disabledDates"
      :highlighted="highlighted"
      :translation="language"
      :page-timestamp="pageTimestamp"
      :sunday-first="sundayFirst"
      :day-cell-content="dayCellContent"
      :use-utc="useUtc"
      @changed-month="handleChangedMonthFromDay"
      @select-date="selectDate"
      @show-month-calendar="showMonthCalendar"
      @selected-disabled="selectDisabledDate"
    />

    <!-- Month View -->
    <ui-date-month
      v-if="allowedToShowView('month')"
      :page-date="pageDate"
      :selected-date="selectedDate"
      :show-month-view="showMonthView"
      :allowed-to-show-view="allowedToShowView"
      :disabled-dates="disabledDates"
      :translation="language"
      :use-utc="useUtc"
      @select-month="selectMonth"
      @show-year-calendar="showYearCalendar"
      @changed-year="setPageDate"
    />

    <!-- Year View -->
    <ui-date-year
      v-if="allowedToShowView('year')"
      :page-date="pageDate"
      :selected-date="selectedDate"
      :show-year-view="showYearView"
      :allowed-to-show-view="allowedToShowView"
      :disabled-dates="disabledDates"
      :translation="language"
      :use-utc="useUtc"
      @select-year="selectYear"
      @changed-decade="setPageDate"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, reactive, ref, watch,
} from 'vue';
import UiDateInput from '@/components/UiDateInput.vue';
import UiDateDay from '@/components/UiDateDay.vue';
import UiDateMonth from '@/components/UiDateMonth.vue';
import UiDateYear from '@/components/UiDateYear.vue';
import utils, { makeDateUtils } from '@/lib/date';
import es from '@/locale/es';

export default defineComponent({
  name: 'UiDate',
  components: {
    UiDateInput,
    UiDateDay,
    UiDateMonth,
    UiDateYear,
  },

  props: {
    value: {
      type: [Date, String, Number],
      default: null,
      validator: val => utils.validateDateInput(val),
    },

    name: {
      type: String,
      default: null,
    },

    refName: {
      type: String,
      default: 'datePicker',
    },

    id: {
      type: [String, Number],
      default: null,
    },

    format: {
      type: [String, Function],
      default: 'dd/MM/yyyy',
    },

    language: {
      type: Object,
      default: () => es,
    },

    openDate: {
      type: [Date, String, Number],
      default: null,
      validator: val => utils.validateDateInput(val),
    },

    dayCellContent: Function,
    fullMonthName: Boolean,

    disabledDates: {
      type: Object,
      default: () => ({}),
    },

    highlighted: {
      type: Object,
      default: () => ({}),
    },

    placeholder: String,
    inline: Boolean,
    sundayFirst: Boolean,
    clearButton: Boolean,
    initialView: String,
    disabled: Boolean,
    required: Boolean,
    readonly: Boolean,
    useUtc: Boolean,

    minimumView: {
      type: String,
      default: 'day',
    },

    maximumView: {
      type: String,
      default: 'year',
    },

    size: {
      type: String,
      default: null,
    },

    color: {
      type: String,
      default: null,
    },
  },
  emits: ['changed-year', 'changed-month', 'selected-disabled', 'closed', 'selected', 'input', 'cleared'],

  setup(props, context) {
    const dateUtils = makeDateUtils(props.useUtc);
    const startDate = props.openDate ? new Date(props.openDate) : new Date();
    const pageTimestamp = ref(dateUtils.setDate(startDate, 1));
    const pageDate = computed(() => new Date(pageTimestamp.value));
    const selectedDate = ref<Date | null>(null);

    const computedInitialView = computed(() => (props.initialView ? props.initialView : props.minimumView));
    const showDayView = ref(false);
    const showMonthView = ref(false);
    const showYearView = ref(false);
    const isOpen = computed(() => showDayView.value || showMonthView.value || showYearView.value);

    let resetTypedDate = new Date();
    const isInline = computed(() => !!props.inline);

    const close = (emitEvent = false) => {
      showYearView.value = false;
      showMonthView.value = false;
      showDayView.value = false;

      if (!isInline.value) {
        if (emitEvent) {
          context.emit('closed');
        }
      }
    };

    const setPageDate = (date: Date | null = null) => {
      if (!date) {
        if (props.openDate) {
          date = new Date(props.openDate);
        } else {
          date = new Date();
        }
      }
      pageTimestamp.value = dateUtils.setDate(new Date(date), 1);
    };

    const resetDefaultPageDate = () => {
      if (selectedDate.value === null) {
        setPageDate();
        return;
      }

      setPageDate(selectedDate.value);
    };

    const allowedToShowView = (view: string) => {
      const views = ['day', 'month', 'year'];
      const minimumViewIndex = views.indexOf(props.minimumView);
      const maximumViewIndex = views.indexOf(props.maximumView);
      const viewIndex = views.indexOf(view);
      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex;
    };

    const showDayCalendar = () => {
      if (!allowedToShowView('day')) {
        return false;
      }

      close();
      showDayView.value = true;
      return true;
    };

    const showMonthCalendar = () => {
      if (!allowedToShowView('month')) {
        return false;
      }

      close();
      showMonthView.value = true;
      return true;
    };

    const showYearCalendar = () => {
      if (!allowedToShowView('year')) {
        return false;
      }

      close();
      showYearView.value = true;
      return true;
    };

    const setInitialView = () => {
      const initialView = computedInitialView.value;
      if (!allowedToShowView(initialView)) {
        throw new Error(`initialView '${props.initialView}' cannot be rendered based on minimum '${props.minimumView}' and maximum '${props.maximumView}'`);
      }
      switch (initialView) {
        case 'year':
          showYearCalendar();
          break;
        case 'month':
          showMonthCalendar();
          break;
        default:
          showDayCalendar();
          break;
      }
    };

    const showCalendar = () => {
      if (props.disabled || isInline.value) {
        return false;
      }
      if (isOpen.value) {
        return close(true);
      }

      setInitialView();
      return true;
    };

    const setDate = (timestamp: number) => {
      const date = new Date(timestamp);
      selectedDate.value = date;
      setPageDate(date);
      context.emit('selected', date);
      context.emit('input', date);
    };

    const clearDate = () => {
      selectedDate.value = null;
      setPageDate();
      context.emit('selected', null);
      context.emit('input', null);
      context.emit('cleared');
    };

    const selectDate = (date) => {
      setDate(date.timestamp);
      if (!isInline.value) {
        close(true);
      }

      resetTypedDate = new Date();
    };

    const selectDisabledDate = (date: Date) => {
      context.emit('selected-disabled', date);
    };

    const selectMonth = (month: any) => {
      const date = new Date(month.timestamp);
      if (allowedToShowView('day')) {
        setPageDate(date);
        context.emit('changed-month', month);
        showDayCalendar();
      } else {
        selectDate(month);
      }
    };

    const selectYear = (year: any) => {
      const date = new Date(year.timestamp);
      if (allowedToShowView('month')) {
        setPageDate(date);
        context.emit('changed-year', year);
        showMonthCalendar();
      } else {
        selectDate(year);
      }
    };

    const setValue = (date: string | number | Date | null) => {
      if (typeof date === 'string' || typeof date === 'number') {
        const parsed = new Date(date);
        date = isNaN(parsed.valueOf()) ? null : parsed;
      }
      if (!date) {
        setPageDate();
        selectedDate.value = null;
        return;
      }
      selectedDate.value = date;
      setPageDate(date);
    };

    const handleChangedMonthFromDay = (date: Date) => {
      setPageDate(date);
      context.emit('changed-month', date);
    };

    const setTypedDate = (date: Date) => {
      setDate(date.getTime());
    };

    const init = () => {
      if (props.value) {
        setValue(props.value);
      }
      if (isInline.value) {
        setInitialView();
      }
    };

    watch(() => props.openDate, () => setPageDate());
    watch(() => props.value, () => setValue(props.value));
    watch(() => props.initialView, () => setInitialView());

    onMounted(() => init());

    return {
      init,
      dateUtils,
      pageTimestamp,
      pageDate,
      selectedDate,
      computedInitialView,
      showDayView,
      showMonthView,
      showYearView,
      isOpen,
      resetTypedDate,
      isInline,
      close,
      setPageDate,
      resetDefaultPageDate,
      allowedToShowView,
      showCalendar,
      showDayCalendar,
      showMonthCalendar,
      showYearCalendar,
      setDate,
      selectDate,
      clearDate,
      selectDisabledDate,
      selectMonth,
      selectYear,
      setValue,
      handleChangedMonthFromDay,
      setTypedDate,
    };
  },
});
</script>
