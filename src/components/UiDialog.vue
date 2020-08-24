<template>
  <teleport to="body">
    <transition name="ui-dialog-fade">
      <div
        v-show="visibility"
        ref="dialogContainer"
        :class="{
          'ui-dialog__container': true,
          'is-mask': mask && !draggable && fullscreen !== true,
        }"
        :style="styles"
        @click="mask ? close() : null"
      >
        <div
          :class="{
            'ui-dialog': true,
            'is-fullscreen': fullscreen === true,

            // Fullscreen del breakpoint hacia abajo
            'is-fullscreen--mobile': fullscreen.m,
            'is-fullscreen--mobile-l': fullscreen.ml,
            'is-fullscreen--tablet': fullscreen.t,
            'is-fullscreen--desktop': fullscreen.d,
            'is-fullscreen--desktop-l': fullscreen.dl,
            'is-fullscreen--desktop-xl': fullscreen.dxl,
          }"
          :style="containerStyles"
          @click.stop
        >
          <header class="ui-dialog__header" @mousedown="dragMouseDown">
            <div>
              <slot name="header" />
            </div>

            <div class="ui-dialog__actions">
              <slot name="actions">
                <ui-icon
                  icon="close"
                  :width="21"
                  @click="close"
                />
              </slot>
            </div>
          </header>

          <div class="ui-dialog__body">
            <main class="ui-dialog__main">
              <slot />
            </main>

            <footer class="ui-dialog__footer">
              <slot name="footer" />
            </footer>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiDialog',
  props: {
    mask: {
      type: Boolean,
      default: true,
    },

    fullscreen: {
      type: [Boolean, Object],
      default: false,
    },

    draggable: {
      type: Boolean,
      default: false,
    },

    visibility: {
      type: Boolean,
      default: false,
    },

    width: {
      type: String,
      default: null,
    },

    maxWidth: {
      type: String,
      default: null,
    },

    minWidth: {
      type: String,
      default: null,
    },
  },

  emits: ['update:visibility'],

  data() {
    return {
      positions: {
        clientX: 0,
        clientY: 0,
        movementX: 0,
        movementY: 0,
      },

      defaultPositions: {
        top: null,
        left: null,
      },
    };
  },

  computed: {
    hasFooter(): boolean {
      return !!this.$slots.footer;
    },

    styles(): object {
      const styles: any = {};

      if (this.width && (!this.mask || this.draggable)) {
        styles.width = this.width;
      }

      return styles;
    },

    containerStyles(): object {
      const styles: any = {};

      if (this.width) styles.width = this.width;
      if (this.minWidth) styles['min-width'] = this.minWidth;
      if (this.maxWidth) styles['max-width'] = this.maxWidth;

      return styles;
    },
  },

  watch: {
    visibility() {
      if (this.visibility === false) {
        // Espera a que finalice la animación para resetear posición del diálogo
        setTimeout(() => {
          (this.$refs.dialogContainer as any).style.top = this.defaultPositions.top;
          (this.$refs.dialogContainer as any).style.left = this.defaultPositions.left;
        }, 190);
      }
    },
  },

  mounted() {
    this.defaultPositions.top = (this.$refs.dialogContainer as any).style.top;
    this.defaultPositions.left = (this.$refs.dialogContainer as any).style.left;
  },

  methods: {
    close() {
      this.$emit('update:visibility', false);
    },

    dragMouseDown(event: MouseEvent) {
      if (!this.draggable) return;

      event.preventDefault();
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      document.onmousemove = this.drag;
      document.onmouseup = this.stopDrag;
    },

    drag(event: MouseEvent) {
      if (!this.draggable) return;

      event.preventDefault();
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;

      (this.$refs.dialogContainer as any).style.top = `${(this.$refs.dialogContainer as any).offsetTop - this.positions.movementY}px`;
      (this.$refs.dialogContainer as any).style.left = `${(this.$refs.dialogContainer as any).offsetLeft - this.positions.movementX}px`;
    },

    stopDrag() {
      document.onmouseup = null;
      document.onmousemove = null;
    },
  },
});
</script>
