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
  const showAlertBox = ref(false);
  const alertDefaultOptions = reactive({
    type: 'error',
    okButton: 'OK',
    okButtonColor: 'primary',
    okButtonAction: null,
    cancelButton: 'Cancelar',
    cancelButtonColor: 'danger',
    cancelButtonAction: null,
    showCancelButton: false,
    message: '',
    title: '',
  });

  const alertComponent = ref<VNode>(h(UiAlertBox, { ...alertDefaultOptions }));

  const openAlert = (options: UiAlertBoxOptions) => {
    const _options = { ...alertDefaultOptions, ...options };
    showAlertBox.value = true;
    alertComponent.value = h(UiAlertBox, { ..._options });
  };

  const closeAlert = () => {
    showAlertBox.value = false;
  };

  return {
    showAlertBox,
    alertComponent,
    alertDefaultOptions,
    openAlert,
    closeAlert,
  };
};
