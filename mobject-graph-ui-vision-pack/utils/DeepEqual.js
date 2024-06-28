export function deepEqual(object1, object2) {
  if (object1 === object2) {
    return true;
  }

  if (
    object1 == null ||
    object2 == null ||
    typeof object1 !== "object" ||
    typeof object2 !== "object"
  ) {
    return false;
  }

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(object1[key], object2[key])) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === "object";
}
