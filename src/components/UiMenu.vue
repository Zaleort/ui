<script>
import { defineComponent, h, withModifiers } from 'vue';

export default defineComponent({
  name: 'UiMenu',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    hamburger: {
      type: Boolean,
      default: false,
    },

    collapsed: {
      type: Boolean,
      default: null,
    },

    direction: {
      type: String,
      default: 'vertical',
      validator: (val) => ['vertical', 'horizontal'].indexOf(val) !== -1,
    },
  },

  emits: ['update:collapsed', 'update:visible'],

  data() {
    return {
      isMobile: window.innerWidth < 1024,
    };
  },

  mounted() {
    if (window.innerWidth > 1024) {
      this.$emit('update:visible', true);
    }

    window.addEventListener('resize', this.handleVisible);
  },

  unmounted() {
    window.removeEventListener('resize', this.handleVisible);
  },

  methods: {
    close() {
      this.$emit('update:visible', false);
    },

    closeOnAction() {
      if (this.isMobile && this.hamburger) {
        this.$emit('update:visible', false);
      }
    },

    collapse() {
      this.$emit('update:collapsed', !this.collapsed);
    },

    handleVisible() {
      console.log(window.innerWidth);
      console.log(this.isMobile);

      if (window.innerWidth < 1024 && !this.isMobile) {
        this.$emit('update:visible', false);
        this.isMobile = true;
        return;
      }

      if (window.innerWidth > 1024 && this.isMobile) {
        this.isMobile = false;
        this.$emit('update:visible', true);
      }
    },
  },

  render() {
    let nav = (
      <nav
        onClick={withModifiers(() => ({}), ['stop'])}
        class={{
          'ui-menu': true,
          'ui-menu--horizontal': this.direction === 'horizontal',
          'ui-menu--vertical': this.direction === 'vertical',
          'is-hamburger': this.hamburger,
          'is-visible': this.visible,
          'is-collapsed': this.collapsed,
        }}
      >
      </nav>
    );

    const navChildren = [this.$slots.default()];

    if (this.collapsed !== null) {
      const collapse = h(
        <div onClick={this.collapse} class="ui-menu__collapse">
          <span>
            Colapsar
          </span>
        </div>,
      );

      navChildren.push(collapse);
    }

    nav = h(nav, navChildren);
    if (this.direction === 'vertical' && this.hamburger) {
      return h(
        <div
          class={{
            'ui-menu__mask': true,
            'is-visible': this.visible,
          }}
          onClick={this.close}
        />, [nav],
      );
    }

    return nav;
  },
});
</script>
