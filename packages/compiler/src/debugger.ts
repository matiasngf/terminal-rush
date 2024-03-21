export type LogParams = Parameters<Console['log']>;

class LoggerFactory {
  isDebugMode = false;

  setDebugMode(isDebugMode: boolean) {
    this.isDebugMode = isDebugMode;
  }

  log(...args: LogParams) {
    if (this.isDebugMode) {
      console.log(...args);
    }
  }
}

export const Logger = new LoggerFactory();

