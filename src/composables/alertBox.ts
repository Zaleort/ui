import {
  ref, VNode, reactive, h,
} from 'vue';
import UiAlertBox from '@/components/UiAlertBox.vue';
import { UiAlertBoxOptions } from '@/interfaces/AlertBox';

export default () => {
  const showAlertBox = ref(false);
  const alertDefaultOptions = reactive({
    type: 'error',
    okButton: 'OK',
    okButtonColor: 'primary',
    okButtonAction: undefined,
    cancelButton: 'Cancelar',
    cancelButtonColor: 'danger',
    cancelButtonAction: undefined,
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
