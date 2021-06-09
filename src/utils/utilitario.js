export function isDefined(_variable) {
  return typeof _variable !== 'undefined' && _variable !== null;
}

export function isEmpty(_variable) {
  return isDefined && _variable === '';
}
