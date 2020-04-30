/* eslint-disable @typescript-eslint/no-explicit-any */

export default (obj: any, path: string): any => path.toString()
  .split('.')
  .reduce((branch, key) => (branch ? branch[key] : undefined), obj);
