<template>
  <transition-group
    tag="ul"
    :class="[
      'ui-upload-list',
      { 'is-disabled': disabled }
    ]"
    name="el-list"
  >
    <li
      v-for="file in files"
      :key="file.uid"
      :class="{
        'ui-upload-list__item': true,
        [`is-${file.status}`]: true,
        'focusing': focusing,
      }"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <span class="ui-upload-list__item-name">
          <ui-icon icon="file" />{{ file.name }}
          <label class="ml-2 ui-upload-list__item-status-label">
            <ui-icon icon="check" color="success" />
          </label>
          <ui-icon
            v-if="!disabled"
            icon="close"
            class="ml-2 clickable"
            @click="$emit('remove', file)"
          />
        </span>

        <ui-progress
          size="mini"
          color="primary"
          :show-percent="false"
          :percentage="parsePercentage(file.percentage)"
        />
      </slot>
    </li>
  </transition-group>
</template>
<script>
import { defineComponent, ref } from 'vue';
import UiProgress from '@/components/UiProgress.vue';

export default defineComponent({
  name: 'UiUploadList',
  components: { UiProgress },
  props: {
    files: {
      type: Array,
      default: () => [],
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['remove'],

  setup() {
    const focusing = ref(false);
    const parsePercentage = (val) => parseInt(val, 10);

    return {
      focusing,
      parsePercentage,
    };
  },
});
</script>
