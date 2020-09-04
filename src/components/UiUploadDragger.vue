<template>
  <div
    :class="{
      'ui-upload-dragger': true,
      'is-dragover': dragover
    }"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'UiUploadDragger',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

    accept: {
      type: String,
      default: '',
    },
  },
  emits: ['file'],

  setup(props, context) {
    const dragover = ref(false);
    const onDragover = () => {
      if (!props.disabled) dragover.value = true;
    };

    const onDrop = (e: DragEvent) => {
      if (props.disabled) return;

      dragover.value = false;
      if (!props.accept) {
        context.emit('file', e.dataTransfer?.files);
        return;
      }

      context.emit('file', [].slice.call(e.dataTransfer?.files).filter((file: File) => {
        const { type, name } = file;
        const extension = name.indexOf('.') > -1
          ? `.${name.split('.').pop()}`
          : '';
        const baseType = type.replace(/\/.*$/, '');

        return props.accept.split(',')
          .map(t => t.trim())
          .filter(t => t)
          .some(acceptedType => {
            if (/\..+$/.test(acceptedType)) {
              return extension === acceptedType;
            }

            if (/\/\*$/.test(acceptedType)) {
              return baseType === acceptedType.replace(/\/\*$/, '');
            }

            if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
              return type === acceptedType;
            }

            return false;
          });
      }));
    };

    return {
      dragover,
      onDragover,
      onDrop,
    };
  },
});
</script>
