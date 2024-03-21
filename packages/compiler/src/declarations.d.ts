/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.hbs' {
  const generator: (...args: any[]) => string;
  export default generator;
}
