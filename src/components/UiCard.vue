<template>
  <div
    :class="{
      'ui-card': true,
      [`ui-card--${color}`]: true,
      'is-compact': compact,
    }"
  >
    <header v-if="hasHeader || hasOptions || hasTitle" class="ui-card__header">
      <div
        v-if="hasTitle"
        class="ui-card__title"
        :class="{ 'is-clickable': clickable }"
      >
        <slot name="title" />
      </div>

      <slot name="header" />

      <div
        v-if="hasOptions"
        class="ui-card__options"
      >
        <slot name="options" />
      </div>
    </header>
    <slot />
    <footer
      v-if="hasFooter"
      class="ui-card__footer"
      :class="{ 'is-actions': footerActions }"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiCard',
  props: {
    color: {
      type: String,
      default: 'primary',
    },

    compact: {
      type: Boolean,
      default: false,
    },

    footerActions: {
      type: Boolean,
      default: false,
    },

    clickable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    hasHeader(): boolean {
      return !!this.$slots.header;
    },

    hasTitle(): boolean {
      return !!this.$slots.title;
    },

    hasOptions(): boolean {
      return !!this.$slots.options;
    },

    hasFooter(): boolean {
      return !!this.$slots.footer;
    },
  },
});
</script>
