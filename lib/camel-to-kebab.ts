export default (str: string): string => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
