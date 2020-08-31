<template>
  <div
    v-if="!isClosed"
    :class="{
      'ui-message': true,
      [`ui-message--${color}`]: true,
    }"
  >
    <div>
      <div v-if="hasTitle" class="ui-message__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="ui-message__body">
        <ui-icon
          v-if="icon"
          :icon="icon"
          size="xlarge"
        />
        <slot>{{ message }}</slot>
      </div>
    </div>
    <div v-if="closable || !duration" @click="close">
      <ui-icon icon="close" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiMessage',

  props: {
    id: {
      type: Number,
      default: null,
    },

    closable: {
      type: Boolean,
      default: true,
    },

    title: {
      type: String,
      default: null,
    },

    message: {
      type: String,
      default: null,
    },

    duration: {
      type: Number,
      default: 2500,
    },

    color: {
      type: String,
      default: 'danger',
    },

    icon: {
      type: String,
      default: null,
    },
  },
  emits: {
    close: null,
  },

  data() {
    return {
      isClosed: false,
    };
  },

  computed: {
    hasTitle(): boolean {
      if (this.title || this.$slots.title) {
        return true;
      }

      return false;
    },
  },

  mounted() {
    if (this.duration > 0) {
      setTimeout(this.close, this.duration);
    }
  },

  methods: {
    close() {
      this.isClosed = true;
      this.$emit('close', true);
    },
  },
});
</script>
