export type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

/**
 * Exclude all function properties from type.
 */
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
