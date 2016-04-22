export function mapObjectToArray(obj, fn) {
  return Object.keys(obj).map(key => fn(obj[key], key));
}

export function mapObjectToObject(obj, fn) {
  return Object.keys(obj)
    .reduce(
      (acc, key) => ({ ...acc, [key]: fn(obj[key], key) }),
      {});
}
