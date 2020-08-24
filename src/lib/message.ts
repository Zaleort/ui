import UiMessage from '@/components/UiMessage.vue';
import { defineComponent } from 'vue';

const Si = defineComponent({ UiMessage });
const instance = Si;

const Message = {
  show: () => instance,
};

export default Message;
