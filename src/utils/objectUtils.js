export function mapObject(obj, fn) {
  return Object.keys(obj).map(key => fn(obj[key], key));
}

export function reduceObject(obj, fn, acc) {
  return Object.keys(obj).map(key => fn(acc, obj[key], key));
}
