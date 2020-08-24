<template>
  <main class="ui-main">
    <slot />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiMain',
});
</script>
