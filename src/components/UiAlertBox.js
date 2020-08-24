import { h, defineComponent } from 'vue';

let button;
export const UiAlertBox = defineComponent({
  name: 'UiAlertBox',
  props: {
    title: {
      type: String,
      default: null,
    },

    message: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      default: 'error',
      validator: (val) => ['error', 'warning', 'info', 'success'].indexOf(val) !== 1,
    },

    okText: {
      type: String,
      default: 'OK',
    },

    okColor: {
      type: String,
      default: 'primary',
    },

    cancelText: {
      type: String,
      default: 'Cancelar',
    },

    cancelColor: {
      type: String,
      default: 'danger',
    },
  },

  render() {
    return h(
      <div class="ui-alert-box__mask">
        <div
          class={{
            'ui-alert-box': true,
            [`ui-alert-box--${this.type}`]: true,
          }}
        >
          { this.message }
        </div>
      </div>,
    );
  },
});

export function install(app) {
  button = app.component('UiAlertBox', UiAlertBox);
}

export const alert = {

};
