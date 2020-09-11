<template>
  <ui-topbar>
    Topbar
  </ui-topbar>

  <ui-container>
    <ui-menu
      v-model:visible="menuVisible"
      v-model:collapsed="menuCollapsed"
      hamburger
    >
      <ui-menu-item icon="close">
        Ave María
      </ui-menu-item>
      <ui-menu-item icon="error">
        Cuando serás mía
      </ui-menu-item>
    </ui-menu>

    <ui-main>
      <ui-button
        plain
        @click="menuVisible = !menuVisible"
      >
        Open menú
      </ui-button>

      <ui-button @click="visibility = true">
        Open dialog
      </ui-button>

      <ui-button @click="tryShowAlert">
        Open alert
      </ui-button>

      <ui-button @click="tryShowAlert(true)">
        Open alert 2
      </ui-button>

      <ui-button @click="showMessage({ message: 'Madriguera', duration: 0, icon: 'chevronUp' })">
        Open message
      </ui-button>

      <ui-loading
        :loading="true"
      />

      <ui-progress
        :percentage="percentage"
        loading
        pill
      />

      <ui-upload drag multiple />

      <ui-tabs v-model:active="activeTab" :tabs="[{ name: 'form', description: 'Formulario' }, { name: 'select', description: 'Select' }]">
        <ui-tabs-panel name="form">
          <ui-form
            gutter="normal"
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
              <ui-checkbox v-model:checked="check" label="si" />
              <ui-switch v-model:checked="check" label="si" />
            </ui-form-item>
            <ui-form-item
              label="A ver qué pasa"
            >
              <ui-radio-group v-model:value="radioValue">
                <ui-radio
                  label="Amnistía"
                />
                <ui-radio
                  label="Locura"
                />
                <ui-radio
                  label="Transcendente"
                />
              </ui-radio-group>
            </ui-form-item>
          </ui-form>
        </ui-tabs-panel>

        <ui-tabs-panel name="select">
          <ui-select
            v-model:value="selectValue"
            filterable
            multiple
            allow-create
            loading
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

      <ui-table
        v-model:items="tableItems"
        stripe
        :headings="[
          { name: 'Nombre', sortable: true, prop: 'nombre' },
          { name: 'Apellido', sortable: true, prop: 'apellido' },
          { name: 'Apellido 2', sortable: true, prop: 'apellido2' },
          { name: 'Edad', sortable: true, prop: 'edad' },
        ]"
      >
        <ui-table-row v-for="item of tableItems" :key="item.id">
          <ui-table-data>
            {{ item.nombre }}
          </ui-table-data>
          <ui-table-data>
            {{ item.apellido }}
          </ui-table-data>
          <ui-table-data>
            {{ item.apellido2 }}
          </ui-table-data>
          <ui-table-data>
            {{ item.edad }}
          </ui-table-data>
        </ui-table-row>
      </ui-table>
    </ui-main>
  </ui-container>

  <component
    :is="alertComponent"
    :show="showAlertBox"
    @ok="closeAlert"
    @cancel="closeAlert"
  />

  <ui-messages v-model:messages="messages" />

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
import composableAlert from '@/composables/alertBox';
import composableMessage from '@/composables/message';

export default defineComponent({
  name: 'App',

  setup() {
    return {
      ...composableAlert(),
      ...composableMessage(),
    };
  },

  data() {
    return {
      value: 'Antoiine',
      visibility: false,
      visibility2: false,
      check: false,
      radioValue: { name: 'Antonio' },
      radioValue2: { name: 'Juan' },
      radioValue3: { name: 'José' },
      menuVisible: false,
      menuCollapsed: false,
      selectValue: 1,
      activeTab: 'form',
      options: [
        { id: 1, descripcion: 'Caoba' },
        { id: 2, descripcion: 'Almendrero' },
        { id: 3, descripcion: 'Xenoverso' },
      ],

      tableItems: [
        {
          id: 1, nombre: 'Antonio', apellido: 'Gómez', apellido2: 'Cabrera', edad: 24,
        },
        {
          id: 1, nombre: 'Jose', apellido: 'Antonio', apellido2: 'Trinidad', edad: 36,
        },
        {
          id: 1, nombre: 'Lindsay', apellido: 'Johnson', apellido2: 'Pozo', edad: 94,
        },
      ],

      percentage: 0,
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

  mounted() {
    const interval = setInterval(() => {
      this.percentage += 1;

      if (this.percentage === 100) {
        clearInterval(interval);
      }
    }, 120);
  },

  methods: {
    say() {
      console.log('Hola');
    },

    tryShowAlert(manolo) {
      console.log(this.alertComponent);

      if (manolo === true) {
        this.openAlert({
          message: 'Tomaya',
          title: 'Engale',
          type: 'success',
          showCancelButton: true,
        });

        return;
      }

      this.openAlert({
        message: 'Así soy yo',
        title: 'Me gusta la mortadela',
        closeOnMask: false,
      });
    },
  },
});
</script>
