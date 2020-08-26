<script lang="ts">
import { defineComponent, inject, h } from 'vue';

export default defineComponent({
  name: 'UiCol',
  props: {
    tag: {
      type: String,
      default: 'div',
    },

    grow: {
      type: Boolean,
      default: false,
    },

    span: {
      type: Number,
      default: undefined,
    },

    m: {
      type: Number,
      default: undefined,
    },

    ml: {
      type: Number,
      default: undefined,
    },

    t: {
      type: Number,
      default: undefined,
    },

    d: {
      type: Number,
      default: undefined,
    },

    dl: {
      type: Number,
      default: undefined,
    },

    dxl: {
      type: Number,
      default: undefined,
    },
  },

  // Sin setup por ahora Vue no detecta el tipo de Gutter (rc-5)
  setup() {
    const gutter = inject('gutter', 'normal');

    return {
      gutter,
    };
  },

  render() {
    const classList = {
      'ui-col': true,
      'ui-col--grow': this.grow,
      [`ui-col--gutter-${this.gutter}`]: this.gutter,
      [`ui-col-${this.span}`]: this.span >= 0,
      [`ui-col-m-${this.m}`]: this.m >= 0,
      [`ui-col-ml-${this.ml}`]: this.ml >= 0,
      [`ui-col-t-${this.t}`]: this.t >= 0,
      [`ui-col-d-${this.d}`]: this.d >= 0,
      [`ui-col-dl-${this.dl}`]: this.dl >= 0,
      [`ui-col-dxl-${this.dxl}`]: this.dxl >= 0,
    };

    return h(this.tag, {
      class: classList,
    }, this.$slots.default ? this.$slots.default() : []);
  },
});
</script>
