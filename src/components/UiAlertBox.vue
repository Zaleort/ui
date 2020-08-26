<template>
  <teleport to="body">
    <transition name="ui-alert-box-fade">
      <div
        v-if="show"
        class="ui-alert-box__mask"
        @click="alertCancel"
      >
        <div
          :class="{
            'ui-alert-box': true,
            [`ui-alert-box--${type}`]: true,
          }"
          @click.stop
        >
          <div class="ui-alert-box__body">
            <ui-icon
              class="mr-3"
              size="x2"
              :icon="type"
            />
            <div>
              <span class="ui-alert-box__title">{{ title }}</span>
              {{ message }}
            </div>
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

export default defineComponent({
  name: 'UiAlertBox',
  props: {
    type: {
      type: String,
      default: 'error',
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
