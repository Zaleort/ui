<template>
  <ui-topbar>
    Topbar
  </ui-topbar>

  <ui-container>
    <ui-menu
      v-model:visible="menuVisible"
      hamburger
    >
      <ui-menu-item>
        Ave María
      </ui-menu-item>
      <ui-menu-item>
        Cuando serás mía
      </ui-menu-item>
    </ui-menu>

    <ui-main>
      <ui-button @click="menuVisible = !menuVisible">
        Open menú
      </ui-button>

      <ui-button @click="visibility = true">
        Open dialog
      </ui-button>

      <ui-tabs v-model:active="activeTab" :tabs="[{ name: 'form', description: 'Formulario' }, { name: 'select', description: 'Select' }]">
        <ui-tabs-panel name="form">
          <ui-form
            :gutter="10"
            size="small"
            inline
          >
            <ui-form-item
              :span="8"
              label="Nombre"
            >
              <ui-input />
            </ui-form-item>
            <ui-form-item
              :span="8"
              label="Nombre"
            >
              <ui-input />
            </ui-form-item>
            <ui-form-item
              :span="8"
              label="Nombre"
            >
              <ui-input />
            </ui-form-item>
            <ui-form-item
              :span="12"
              label="Nombre"
            >
              <ui-input />
            </ui-form-item>
            <ui-form-item
              label="Nombre"
            >
              <ui-input />
            </ui-form-item>
            <ui-form-item
              label="¿Estamos ganando?"
            >
              <ui-checkbox label="si" />
            </ui-form-item>
          </ui-form>
        </ui-tabs-panel>

        <ui-tabs-panel name="select">
          <ui-select
            v-model:value="selectValue"
            filterable
            multiple
          >
            <ui-option
              v-for="option of options"
              :key="option.id"
              :value="option.id"
              :label="option.descripcion"
            />
          </ui-select>
        </ui-tabs-panel>
      </ui-tabs>
    </ui-main>
  </ui-container>

  <ui-dialog v-model:visibility="visibility" :fullscreen="true">
    <template #header>
      Amapola del señor
    </template>

    <ui-tag>Cuerpo</ui-tag>

    <template #footer>
      <ui-button @click="visibility2 = true">
        Click me
      </ui-button>
    </template>
  </ui-dialog>

  <ui-dialog
    v-model:visibility="visibility2"
    :fullscreen="{ ml: true }"
    :draggable="true"
  >
    <template #header>
      Una cosa te digo: dos escopetas tengo
    </template>

    <ui-alert color="info">
      <template #title>
        Pasostán Ramón
      </template>
      Si están pa eso
    </ui-alert>

    <template #footer>
      <ui-button>Click me</ui-button>
    </template>
  </ui-dialog>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  data() {
    return {
      value: 'Antoiine',
      visibility: false,
      visibility2: false,
      check: false,
      menuVisible: false,
      selectValue: 1,
      activeTab: 'form',
      options: [
        { id: 1, descripcion: 'Caoba' },
        { id: 2, descripcion: 'Almendrero' },
        { id: 3, descripcion: 'Xenoverso' },
      ],
    };
  },

  watch: {
    check() {
      console.log(this.check);
    },

    selectValue() {
      console.log('Select Value: ');
      console.log(this.selectValue);
    },

    activeTab() {
      console.log(this.activeTab);
    },
  },

  methods: {
    say() {
      console.log('Hola');
    },
  },
});
</script>

<style lang="scss">
#app {

}
</style>
