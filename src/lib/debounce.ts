const debounde = (delay: number, callback: Function) => {
  console.log('debounce');
  let timeoutID: any;
  let cancelled = false;

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  }

  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  }

  function wrapper(...arguments_: any[]) {
    console.log('Qué pasa');
    if (cancelled) {
      return;
    }

    function exec() {
      callback(arguments_);
    }

    clearExistingTimeout();
    timeoutID = setTimeout(exec, delay);
  }

  wrapper.cancel = cancel;
  return wrapper;
};

export default debounde;
