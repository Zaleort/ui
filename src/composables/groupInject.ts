import { inject, ComputedRef } from 'vue';

export default () => {
  const groupValue = inject<ComputedRef | null>('groupValue', null);
  const groupUpdateValue = inject<Function | null>('groupUpdateValue', null);
  const groupHandleChange = inject<Function | null>('groupHandleChange', null);
  const groupSize = inject<ComputedRef | null>('groupSize', null);
  const groupDisabled = inject<ComputedRef | null>('groupDisabled', null);
  const groupColor = inject<string | null>('groupColor', null);
  const isRadioGroup = typeof groupUpdateValue === 'function' && typeof groupHandleChange === 'function';

  return {
    groupValue,
    groupUpdateValue,
    groupHandleChange,
    groupSize,
    groupDisabled,
    groupColor,
    isRadioGroup,
  };
};
