<template>
  <teleport to="body">
    <transition name="ui-alert-box-fade">
      <div
        v-if="show"
        class="ui-alert-box__mask"
        @click="closeOnMask ? alertCancel() : null"
      >
        <div
          :class="{
            'ui-alert-box': true,
            [`ui-alert-box--${type}`]: true,
          }"
          @click.stop
        >
          <header class="ui-alert-box__title">
            {{ title }}
          </header>
          <div class="ui-alert-box__body">
            <ui-icon
              class="mr-4"
              size="xlarge"
              :icon="type"
            />
            <slot>{{ message }}</slot>
          </div>
          <footer class="ui-alert-box__footer">
            <ui-button
              :color="okButtonColor"
              size="small"
              @click="alertOk(okButtonAction)"
            >
              {{ okButton }}
            </ui-button>
            <ui-button
              v-if="showCancelButton"
              :color="cancelButtonColor"
              size="small"
              class="mr-2"
              @click="alertCancel(cancelButtonAction)"
            >
              {{ cancelButton }}
            </ui-button>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiButton from '@/components/UiButton.vue';

export default defineComponent({
  name: 'UiAlertBox',
  components: { UiButton },
  props: {
    type: {
      type: String,
      default: 'error',
    },

    closeOnMask: {
      type: Boolean,
      default: true,
    },

    okButton: {
      type: String,
      default: 'OK',
    },

    okButtonColor: {
      type: String,
      default: 'primary',
    },

    okButtonAction: {
      type: Function,
      default: null,
    },

    cancelButton: {
      type: String,
      default: 'Cancelar',
    },

    cancelButtonColor: {
      type: String,
      default: 'danger',
    },

    cancelButtonAction: {
      type: Function,
      default: null,
    },

    showCancelButton: {
      type: Boolean,
      default: false,
    },

    message: {
      type: String,
      default: '',
    },

    title: {
      type: String,
      default: '',
    },

    show: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['ok', 'cancel'],
  setup(props, context) {
    const alertOk = () => {
      if (typeof props.okButtonAction === 'function') {
        props.okButtonAction();
      }

      context.emit('ok');
    };

    const alertCancel = () => {
      if (typeof props.cancelButtonAction === 'function') {
        props.cancelButtonAction();
      }

      context.emit('cancel');
    };

    return {
      alertOk,
      alertCancel,
    };
  },
});
</script>
