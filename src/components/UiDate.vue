<template>
  <div class="ui-date">
    <ui-date-input
      :id="id"
      :selected-date="selectedDate"
      :reset-typed-date="resetTypedDate"
      :format="format"
      :translation="translation"
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
      :translation="translation"
      :page-timestamp="pageTimestamp"
      :is-rtl="isRtl"
      :monday-first="mondayFirst"
      :day-cell-content="dayCellContent"
      :use-utc="useUtc"
      @changed-month="handleChangedMonthFromDayUiDate"
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
      :translation="translation"
      :is-rtl="isRtl"
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
      :translation="translation"
      :is-rtl="isRtl"
      :use-utc="useUtc"
      @select-year="selectYear"
      @changed-decade="setPageDate"
    />
  </div>
</template>

<script>
import UiDateInput from '@/components/UiDateInput.vue';
import UiDateDay from '@/components/UiDateDay.vue';
import UiDateMonth from '@/components/UiDateMonth.vue';
import UiDateYear from '@/components/UiDateYear.vue';
import utils, { makeDateUtils } from '@/lib/date';
import es from '@/locale/es';

export default {
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
      default: 'dd MMM yyyy',
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
      default: null,
    },

    highlighted: {
      type: Object,
      default: null,
    },

    placeholder: String,
    inline: Boolean,
    mondayFirst: Boolean,
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
  data() {
    const startDate = this.openDate ? new Date(this.openDate) : new Date();
    const constructedDateUtils = makeDateUtils(this.useUtc);
    const pageTimestamp = constructedDateUtils.setDate(startDate, 1);
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp,
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      /*
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      showMonthView: false,
      showYearView: false,
      /*
       * Positioning
       */
      calendarHeight: 0,
      resetTypedDate: new Date(),
      utils: constructedDateUtils,
    };
  },
  computed: {
    computedInitialView() {
      if (!this.initialView) {
        return this.minimumView;
      }
      return this.initialView;
    },
    pageDate() {
      return new Date(this.pageTimestamp);
    },
    translation() {
      return this.language;
    },
    calendarStyle() {
      return {
        position: this.isInline ? 'static' : undefined,
      };
    },
    isOpen() {
      return this.showDayView || this.showMonthView || this.showYearView;
    },
    isInline() {
      return !!this.inline;
    },
    isRtl() {
      return this.translation.rtl === true;
    },
  },
  watch: {
    value(value) {
      this.setValue(value);
    },
    openDate() {
      this.setPageDate();
    },
    initialView() {
      this.setInitialView();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * Called in the event that the user navigates to date pages and
     * closes the ui-date without selecting a date.
     */
    resetDefaultPageDate() {
      if (this.selectedDate === null) {
        this.setPageDate();
        return;
      }
      this.setPageDate(this.selectedDate);
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed}
     */
    showCalendar() {
      if (this.disabled || this.isInline) {
        return false;
      }
      if (this.isOpen) {
        return this.close(true);
      }

      this.setInitialView();
      return true;
    },
    /**
     * Sets the initial ui-date page view: day, month or year
     */
    setInitialView() {
      const initialView = this.computedInitialView;
      if (!this.allowedToShowView(initialView)) {
        throw new Error(`initialView '${this.initialView}' cannot be rendered based on minimum '${this.minimumView}' and maximum '${this.maximumView}'`);
      }
      switch (initialView) {
        case 'year':
          this.showYearCalendar();
          break;
        case 'month':
          this.showMonthCalendar();
          break;
        default:
          this.showDayCalendar();
          break;
      }
    },
    /**
     * Are we allowed to show a specific ui-date view?
     * @param {String} view
     * @return {Boolean}
     */
    allowedToShowView(view) {
      const views = ['day', 'month', 'year'];
      const minimumViewIndex = views.indexOf(this.minimumView);
      const maximumViewIndex = views.indexOf(this.maximumView);
      const viewIndex = views.indexOf(view);
      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex;
    },
    /**
     * Show the day ui-date
     * @return {Boolean}
     */
    showDayCalendar() {
      if (!this.allowedToShowView('day')) {
        return false;
      }
      this.close();
      this.showDayView = true;
      return true;
    },
    /**
     * Show the month ui-date
     * @return {Boolean}
     */
    showMonthCalendar() {
      if (!this.allowedToShowView('month')) {
        return false;
      }
      this.close();
      this.showMonthView = true;
      return true;
    },
    /**
     * Show the year ui-date
     * @return {Boolean}
     */
    showYearCalendar() {
      if (!this.allowedToShowView('year')) {
        return false;
      }
      this.close();
      this.showYearView = true;
      return true;
    },
    /**
     * Set the selected date
     * @param {Number} timestamp
     */
    setDate(timestamp) {
      const date = new Date(timestamp);
      this.selectedDate = date;
      this.setPageDate(date);
      this.$emit('selected', date);
      this.$emit('input', date);
    },
    /**
     * Clear the selected date
     */
    clearDate() {
      this.selectedDate = null;
      this.setPageDate();
      this.$emit('selected', null);
      this.$emit('input', null);
      this.$emit('cleared');
    },
    /**
     * @param {Object} date
     */
    selectDate(date) {
      this.setDate(date.timestamp);
      if (!this.isInline) {
        this.close(true);
      }
      this.resetTypedDate = new Date();
    },
    /**
     * @param {Object} date
     */
    selectDisabledDate(date) {
      this.$emit('selected-disabled', date);
    },
    /**
     * @param {Object} month
     */
    selectMonth(month) {
      const date = new Date(month.timestamp);
      if (this.allowedToShowView('day')) {
        this.setPageDate(date);
        this.$emit('changed-month', month);
        this.showDayCalendar();
      } else {
        this.selectDate(month);
      }
    },
    /**
     * @param {Object} year
     */
    selectYear(year) {
      const date = new Date(year.timestamp);
      if (this.allowedToShowView('month')) {
        this.setPageDate(date);
        this.$emit('changed-year', year);
        this.showMonthCalendar();
      } else {
        this.selectDate(year);
      }
    },
    /**
     * Set the dateui-date value
     * @param {Date|String|Number|null} date
     */
    setValue(date) {
      if (typeof date === 'string' || typeof date === 'number') {
        const parsed = new Date(date);
        date = isNaN(parsed.valueOf()) ? null : parsed;
      }
      if (!date) {
        this.setPageDate();
        this.selectedDate = null;
        return;
      }
      this.selectedDate = date;
      this.setPageDate(date);
    },
    /**
     * Sets the date that the calendar should open on
     */
    setPageDate(date) {
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate);
        } else {
          date = new Date();
        }
      }
      this.pageTimestamp = this.utils.setDate(new Date(date), 1);
    },
    /**
     * Handles a month change from the day ui-date
     */
    handleChangedMonthFromDayUiDate(date) {
      this.setPageDate(date);
      this.$emit('changed-month', date);
    },
    /**
     * Set the date from a typedDate event
     */
    setTypedDate(date) {
      this.setDate(date.getTime());
    },
    /**
     * Close all calendar layers
     * @param {Boolean} emitEvent - emit close event
     */
    close(emitEvent) {
      this.showYearView = false;
      this.showMonthView = false;
      this.showDayView = false;

      if (!this.isInline) {
        if (emitEvent) {
          this.$emit('closed');
        }
        document.removeEventListener('click', this.clickOutside, false);
      }
    },
    /**
     * Initiate the component
     */
    init() {
      if (this.value) {
        this.setValue(this.value);
      }
      if (this.isInline) {
        this.setInitialView();
      }
    },
  },
};
</script>
