<template>
  <div
    :class="{
      'ui-tabs': true,
    }"
  >
    <header class="ui-tabs__nav">
      <div
        v-for="tab of tabs"
        :key="'tab' + tab.name"
        class="ui-tabs__tab"
        :class="{ 'is-active': tab.name === active }"
        @click="$emit('update:active', tab.name)"
      >
        <ui-icon
          v-if="tab.icon"
          icon="icon"
          class="mr-2"
        />
        {{ tab.description }}
      </div>
    </header>

    <main class="ui-tabs__panel">
      <slot />
    </main>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'UiTabs',
  provide() {
    return {
      activeName: computed(() => this.active),
    };
  },

  props: {
    tabs: {
      type: Array,
      required: true,
    },

    active: {
      type: String,
      required: true,
    },
  },

  emits: ['update:active'],
  data() {
    return {

    };
  },
});
</script>
