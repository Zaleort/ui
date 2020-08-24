<template>
  <div
    v-if="action"
    class="ui-menu-item"
    @click="action; close"
  >
    <span>
      <slot />
    </span>
  </div>

  <router-link
    v-else-if="router"
    :to="to"
    class="ui-menu-item"
    @click="close"
  >
    <span>
      <slot />
    </span>
  </router-link>

  <a
    v-else
    :href="to"
    class="ui-menu-item"
    @click="close"
  >
    <span>
      <slot />
    </span>
  </a>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiMenuItem',
  props: {
    to: {
      type: [String, Object],
      default: null,
    },

    router: {
      type: Boolean,
      default: true,
    },

    action: {
      type: Function,
      default: null,
    },
  },

  methods: {
    close() {
      this.$parent.closeOnAction();
    },
  },
});
</script>
