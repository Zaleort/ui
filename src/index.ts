import UiAlert from '@/components/UiAlert.vue';
import UiAlertBox from '@/components/UiAlertBox.vue';
import UiAvatar from '@/components/UiAvatar.vue';
import UiAside from '@/components/UiAside.vue';
import UiBadge from '@/components/UiBadge.vue';
import UiButton from '@/components/UiButton.vue';
import UiCard from '@/components/UiCard.vue';
import UiCheckBox from '@/components/UiCheckBox.vue';
import UiContainer from '@/components/UiContainer.vue';
import UiCol from '@/components/UiCol.vue';
import UiCopy from '@/components/UiCopy.vue';
import UiDialog from '@/components/UiDialog.vue';
import UiDropdown from '@/components/UiDropdown.vue';
import UiDropdownItem from '@/components/UiDropdownItem.vue';
import UiForm from '@/components/UiForm.vue';
import UiFormitem from '@/components/UiFormItem.vue';
import UiIcon from '@/components/UiIcon.vue';
import UiInput from '@/components/UiInput.vue';
import UiLabel from '@/components/UiLabel.vue';
import UiLoading from '@/components/UiLoading.vue';
import UiMain from '@/components/UiMain.vue';
import UiMenu from '@/components/UiMenu.vue';
import UiMenuItem from '@/components/UiMenuItem.vue';
import UiMessage from '@/components/UiMessage.vue';
import UiMessages from '@/components/UiMessages.vue';
import UiOption from '@/components/UiOption.vue';
import UiProgress from '@/components/UiProgress.vue';
import UiRadio from '@/components/UiRadio.vue';
import UiRadioButton from '@/components/UiRadioButton.vue';
import UiRadioGroup from '@/components/UiRadioGroup.vue';
import UiRow from '@/components/UiRow.vue';
import UiSelect from '@/components/UiSelect.vue';
import UiSwitch from '@/components/UiSwitch.vue';
import UiTable from '@/components/UiTable.vue';
import UiTableData from '@/components/UiTableData.vue';
import UiTableRow from '@/components/UiTableRow.vue';
import UiTabs from '@/components/UiTabs.vue';
import UiTabsPanel from '@/components/UiTabsPanel.vue';
import UiTag from '@/components/UiTag.vue';
import UiTopbar from '@/components/UiTopbar.vue';
import UiTooltip from '@/components/UiTooltip.vue';
import UiUpload from '@/components/UiUpload.vue';
import UiUploadDragger from '@/components/UiUploadDragger.vue';
import UiUploadList from '@/components/UiUploadList.vue';
import { App } from 'vue';

const components = [
  UiAlert,
  UiAlertBox,
  UiAvatar,
  UiAside,
  UiBadge,
  UiButton,
  UiCard,
  UiCheckBox,
  UiContainer,
  UiCol,
  UiCopy,
  UiDialog,
  UiDropdown,
  UiDropdownItem,
  UiForm,
  UiFormitem,
  UiIcon,
  UiInput,
  UiLabel,
  UiLoading,
  UiMain,
  UiMenu,
  UiMenuItem,
  UiMessage,
  UiMessages,
  UiOption,
  UiProgress,
  UiRadio,
  UiRadioButton,
  UiRadioGroup,
  UiRow,
  UiSelect,
  UiSwitch,
  UiTable,
  UiTableData,
  UiTableRow,
  UiTabs,
  UiTabsPanel,
  UiTag,
  UiTopbar,
  UiTooltip,
  UiUpload,
  UiUploadDragger,
  UiUploadList,
];

export default {
  install(app: App, options: object) {
    components.forEach((c) => {
      app.component(c.name, c);
    });

    app.directive('click-outside', {
      mounted(el, binding, vnode) {
        el.clickOutsideEvent = (event: Event) => {
          const vm = vnode.appContext;
          const callback = binding.value;
          // here I check that click was outside the el and his childrens
          if (!(el === event.target || el.contains(event.target))) {
            // and if it did, call method provided in attribute value
            return callback.call(vm, event);
          }

          return null;
        };

        document.body.addEventListener('click', el.clickOutsideEvent);
      },

      unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    });
  },
};
