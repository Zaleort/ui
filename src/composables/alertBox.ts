import {
  ref, VNode, reactive, h,
} from 'vue';
import UiAlertBox from '@/components/UiAlertBox.vue';

interface UiAlertBoxOptions {
  type: string;
  okButton: string;
  okButtonColor: string;
  okButtonAction: Function | null;
  cancelButton: string;
  cancelButtonColor: string;
  cancelButtonAction: Function | null;
  showCancelButton: boolean;
  message: string;
  title: string;
}

export default () => {
  const alertComponent = ref<VNode | null>(null);
  const alertOptions = reactive({
    type: 'error',
    okButton: 'Ok',
    okButtonColor: 'primary',
    okButtonAction: null,
    cancelButton: 'Cancelar',
    cancelButtonColor: 'danger',
    cancelButtonAction: null,
    showCancelButton: false,
    message: '',
    title: '',
  });

  const showAlert = (options: UiAlertBoxOptions) => {
    const _options = { ...alertOptions, ...options };
    alertComponent.value = h(UiAlertBox, { ..._options });
  };

  return {
    alertComponent,
    alertOptions,
    showAlert,
  };
};
