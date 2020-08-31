import { ref } from 'vue';
import { UiMessageOptions } from '@/interfaces/Message';

export default () => {
  const messages = ref<UiMessageOptions[]>([]);
  const showMessage = (options: UiMessageOptions) => {
    messages.value.push({ ...options, id: Date.now() });
  };

  return {
    messages,
    showMessage,
  };
};
