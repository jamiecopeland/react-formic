export function mapObjectToArray(obj, fn) {
  return Object.keys(obj).map(key => fn(obj[key], key));
}

export function mapObjectToObject(obj, fn) {
  return Object.keys(obj)
    .reduce(
      (acc, key) => ({ ...acc, [key]: fn(obj[key], key) }),
      {});
}

export function forEachPropertyOfObject(object, fn) {
  Object.keys(object).forEach((propertyName) => {
    fn(object[propertyName], propertyName);
  });
}
