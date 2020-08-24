<template>
  <teleport to="body">
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
        <slot>{{ message }}</slot>
      </div>
      <div v-if="closable || !duration" @click="close">
        X
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiMessage',

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

    duration: {
      type: Number,
      default: 2500,
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
      this.$emit('closed', true);
    },
  },
});
</script>
