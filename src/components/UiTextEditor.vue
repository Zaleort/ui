<template>
  <div class="ui-text-editor">
    <div class="ui-text-editor__options">
      <button
        v-for="(option, i) in editorOptions"
        :key="i"
        :title="option.title"
        :class="{
          'ui-text-editor__option': true,
          'is-active': option.isActive,
        }"

        @click="handleOptionClick(option)"
      >
        <span v-html="option.icon" />
      </button>
    </div>
    <div
      ref="editor"
      contenteditable="true"
      class="ui-text-editor__input"
      :style="{
        minHeight: minHeight,
        maxHeight: maxHeight,
        height: height,
      }"

      @input="handleInput"
      @keydown="handleKeyDown"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
} from 'vue';
import { exec, queryCommandState, queryCommandValue } from '@/lib/textEditor';
import { UiTextEditorOption, UiTextEditorOptions } from '@/interfaces/TextEditor';

export default defineComponent({
  name: 'UiTextEditor',
  props: {
    options: {
      type: Object as PropType<UiTextEditorOptions>,
      default: null,
    },

    minHeight: {
      type: String,
      default: '150px',
    },

    maxHeight: {
      type: String,
      default: '300px',
    },

    height: {
      type: String,
      default: null,
    },
  },

  emits: ['change'],
  setup(props, context) {
    const editor = ref<HTMLElement | null>(null);
    const checkActive = (option: UiTextEditorOption) => {
      console.log(option);
      if (!option.state) return;

      console.log(option.state());
      option.isActive = option.state();
    };

    const defaultOptions = {
      bold: {
        icon: '<b>N</b>',
        title: 'Negrita',
        isActive: false,
        state: () => queryCommandState('bold'),
        result: () => exec('bold'),
      },

      italic: {
        icon: '<i>I</i>',
        title: 'Itálica',
        isActive: false,
        state: () => queryCommandState('italic'),
        result: () => exec('italic'),
      },

      underline: {
        icon: '<u>S</u>',
        title: 'Subrayar',
        isActive: false,
        state: () => queryCommandState('underline'),
        result: () => exec('underline'),
      },

      strikethrough: {
        icon: '<strike>T</strike>',
        title: 'Tachar',
        isActive: false,
        state: () => queryCommandState('strikeThrough'),
        result: () => exec('strikeThrough'),
      },

      heading1: {
        icon: '<b>T<sub>1</sub></b>',
        title: 'Título 1',
        result: () => exec('formatBlock', '<h1>'),
      },

      heading2: {
        icon: '<b>T<sub>2</sub></b>',
        title: 'Título 2',
        result: () => exec('formatBlock', '<h2>'),
      },

      olist: {
        icon: '&#35;',
        title: 'Lista ordenada',
        result: () => exec('insertOrderedList'),
      },

      ulist: {
        icon: '&#8226;',
        title: 'Lista',
        result: () => exec('insertUnorderedList'),
      },
    };

    const editorOptions = computed(() => {
      if (props.options) {
        return reactive<UiTextEditorOptions>({ ...props.options });
      }

      return reactive<UiTextEditorOptions>({ ...defaultOptions });
    });

    const handleInput = (e: any) => {
      if (!editor.value) return;

      const { firstChild } = e.target;
      console.log(firstChild);

      if (firstChild && firstChild.nodeType === 3) exec('formatBlock', '<defaultParagraphSeparator>');
      else if (editor.value.innerHTML === '<br>') editor.value.innerHTML = '';

      context.emit('change', editor.value.innerHTML);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editor.value) return;

      if (e.key === 'Enter' && queryCommandValue('formatBlock') === 'blockquote') {
        setTimeout(() => exec('formatBlock', '<defaultParagraphSeparator>'), 0);
      }
    };

    const handleOptionClick = (option: UiTextEditorOption) => {
      if (editor.value) {
        editor.value.focus();
      }

      option.result();
      checkActive(option);
    };

    const getInnerHtml = () => {
      if (!editor.value) return null;

      return editor.value.innerHTML;
    };

    return {
      editor,
      defaultOptions,
      editorOptions,
      handleInput,
      handleKeyDown,
      handleOptionClick,
      checkActive,
      getInnerHtml,
    };
  },
});
</script>
