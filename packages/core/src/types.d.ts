import { UseConnector } from "@terminal-rush/virtual-app/dist-types/lib/connector";

declare module '*.png';
declare module '*.jpg';
declare module '*.json';
declare module '*.svg';
declare module '*.webp';

declare global {
  interface Window {
    connector: UseConnector
  }
}

export { };
