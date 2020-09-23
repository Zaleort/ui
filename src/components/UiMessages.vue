<template>
  <teleport to="body">
    <div class="ui-message__container">
      <transition-group name="ui-message">
        <ui-message
          v-for="message of messages"
          :key="message.id"
          v-bind="message"
          @close="deleteMessage(message.id)"
        />
      </transition-group>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import UiMessage from '@/components/UiMessage.vue';
import { UiMessageOptions } from '@/interfaces/Message';

export default defineComponent({
  name: 'UiMessages',
  components: { UiMessage },
  props: {
    messages: {
      type: Array as PropType<UiMessageOptions[]>,
      default: () => [],
    },
  },

  emits: ['update:messages'],

  setup(props, context) {
    const deleteMessage = (id: number) => {
      const _messages = props.messages;
      const i = _messages.findIndex(m => m.id === id);
      _messages.splice(i, 1);

      context.emit('update:messages', _messages);
    };

    return { deleteMessage };
  },
});
</script>
