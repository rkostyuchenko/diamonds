export default (inputType: string): boolean => {
  const inputElem = document.createElement('input');
  const smile = '1)';
  let bool;
  inputElem.setAttribute('type', inputType);
  bool = inputElem.type !== 'text' && 'style' in inputElem;

  // First check the type of the input. Is it exactly like we assigned or it was changed to 'text' automatically?
  // Then assign invalid input value.
  // If the value wasn't assigned then it looks like input's clearing is related to its custom interface.
  if (bool) {
    inputElem.value = smile;
    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

    if (/^range$/.test(inputType) && inputElem.style.webkitAppearance !== undefined) {
      document.appendChild(inputElem);

      bool = window.getComputedStyle
        && window.getComputedStyle(inputElem, null).webkitAppearance !== 'textfield'
        && (inputElem.offsetHeight !== 0);

      document.removeChild(inputElem);
    } else if (/^(search|tel)$/.test(inputType)) {
      // There's no any special behaviour for `search` & `tel` in specs.
    } else if (/^(url|email)$/.test(inputType)) {
      // For `url` & `email` we should check their internal validation.
      bool = inputElem.checkValidity && inputElem.checkValidity() === false;
    } else {
      // Check whether input value was transformed into ':)' or not.
      bool = inputElem.value !== smile;
    }
  }

  return !!bool;
};
