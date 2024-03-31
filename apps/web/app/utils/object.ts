/**
 * Group array of objects by given keys
 * @param keys keys to be grouped by
 * @returns an object with objects in `array` grouped by `keys`
 */
export function groupBy<T>(keys: (keyof T)[]) {
  return (array: T[]): Record<string, T[]> =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map(key => obj[key]).join("-");
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {} as Record<string, T[]>);
}
