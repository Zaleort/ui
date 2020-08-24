<template>
  <div v-click-outside="hide" class="ui-dropdown">
    <div @click="toggle">
      <slot />
    </div>

    <transition name="ui-dropdown-show">
      <ul v-show="isVisible" class="ui-dropdown-menu">
        <slot name="menu" />
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiDropdown',
  props: {

  },

  data() {
    return {
      isVisible: false,
    };
  },

  methods: {
    hide() {
      this.isVisible = false;
    },

    toggle() {
      this.isVisible = !this.isVisible;
    },
  },
});
</script>
