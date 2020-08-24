<template>
  <div v-if="!isClosed" :class="classes">
    <div>
      <div v-if="hasTitle" class="ui-alert__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <slot>{{ message }}</slot>
    </div>
    <div
      v-if="closable"
      class="ui-alert__close"
      @click="close"
    >
      <ui-icon icon="close" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiAlert',

  props: {
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

    color: {
      type: String,
      default: 'danger',
      validator: (value: string) => {
        const colores = [
          'primary',
          'secondary',
          'success',
          'warning',
          'danger',
          'info',
          'grey',
        ];

        return colores.indexOf(value) !== -1;
      },
    },
  },

  emits: {
    closed: null,
  },

  data() {
    return {
      isClosed: false,
    };
  },

  computed: {
    classes(): object {
      return {
        'ui-alert': true,
        [`ui-alert--${this.color}`]: true,
      };
    },

    hasTitle(): boolean {
      if (this.title || this.$slots.title) {
        return true;
      }

      return false;
    },
  },

  methods: {
    close() {
      this.isClosed = true;
      this.$emit('closed', true);
    },
  },
});
</script>
