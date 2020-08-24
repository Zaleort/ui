import {
  createApp,
  createVNode,
  render,
  VNode,
} from 'vue';
import Ui from '@/index';
import App from './App.vue';
import '@/scss/main.scss';

const app = createApp(App);

// Reescribir app.component para permitir crear instancias programaticalmente
// holds registered component constructor classes
const _componentConstructors: any = {};

// get hold of the original app.component method, it will be overwritten
const _registerComponent = app.component;

// monkey-patch app.component to return a constructor class
// note: overwriting app.component has side-effects, e.g.
// chaining won't work anymore: app.component('a', ...).component('b', ...).directive('c', ...)
(app.component as any) = (name: string, component: any) => {
  // return already registered component instance if no component is passed
  // in order to support: const MyComponent = app.component('my-component')
  if (!component) return _componentConstructors[name];

  // register the component with the vue app
  _registerComponent(name, component);

  // create a class that can be used to create an instance
  // of the component programatically
  class VueComponent {
    name: string;
    template: any;
    container: string | Element | null;
    mounted: boolean;
    vnode: VNode | null;

    /**
     * @param {{ [propName]: value }} [propsData]
     * Data that will be used to populate props
     */
    constructor(propsData: any) {
      this.name = name;
      this.template = component;
      this.container = null;
      this.mounted = false;
      this.vnode = createVNode(component, propsData);
      this.vnode.appContext = app._context;
    }

    /**
     * Gets the actual component instance proxy (only if mounted)
     */
    get component() {
      return this.vnode?.component?.vnode;
    }

    /**
     * Mounts the component to a container
     *
     * @param {string | Element} container
     * A css selector or Element that we will mount the component to
     */
    mount(container: string | Element) {
      if (this.mounted) {
        throw Error(`Component "${this.name}" is already mounted`);
      }

      if (typeof container === 'string') {
        container = document.querySelector(container) as Element;
      }

      if ((!container as any) instanceof Element) {
        throw Error('Must pass a valid selector or HTMLElement');
      }

      render(this.vnode, (container as Element));
      this.container = container;
      this.mounted = true;
    }

    /**
     * Destroys the component - this will also unmount it
     */
    destroy() {
      if (this.mounted) {
        render(null, (this.container as Element));
      }

      this.container = null;
      this.vnode = null;
      this.mounted = false;
    }
  }

  // remember the component constructor class so we can provide it later on
  _componentConstructors[name] = VueComponent;
  return VueComponent;
};

Ui.install(app, {});
app.mount('#app');
