<script>
import {
  defineComponent, h, withModifiers, ref, onMounted, onUnmounted,
} from 'vue';

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

  setup(props, context) {
    const isMobile = ref(window.innerWidth < 1024);
    const close = () => context.emit('update:visible', false);
    const closeOnAction = () => {
      if (isMobile.value && props.hamburger) {
        context.emit('update:visible', false);
      }
    };

    const collapse = () => {
      context.emit('update:collapsed', !props.collapsed);
    };

    const handleVisible = () => {
      if (window.innerWidth < 1024 && !isMobile.value) {
        context.emit('update:visible', false);
        isMobile.value = true;
        return;
      }

      if (window.innerWidth > 1024 && isMobile.value) {
        isMobile.value = false;
        context.emit('update:visible', true);
      }
    };

    onMounted(() => {
      if (window.innerWidth > 1024) {
        context.emit('update:visible', true);
      }

      window.addEventListener('resize', handleVisible);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleVisible);
    });

    return {
      isMobile,
      close,
      closeOnAction,
      collapse,
      handleVisible,
    };
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
        <div onClick={this.collapse} class="ui-menu-item ui-menu-item--collapse">
          <ui-icon
            icon={'angleDoubleLeft'}
            class={{
              'mr-2': true,
              'ui-icon--reverse': this.collapsed,
            }}
            />
          <span class="ui-menu-item__span">
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
            'is-collapsed': this.collapsed,
          }}
          onClick={this.close}
        />, [nav],
      );
    }

    return nav;
  },
});
</script>
