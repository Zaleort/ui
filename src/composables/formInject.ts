import { inject } from 'vue';

export default () => {
  const formDisabled = inject('formDisabled', false);
  const formSize = inject('formSize', null);
  const formValidators = inject('formValidators');
  const formValidateOn = inject('formValidateOn', 'submit');

  return {
    formDisabled,
    formSize,
    formValidators,
    formValidateOn,
  };
};
