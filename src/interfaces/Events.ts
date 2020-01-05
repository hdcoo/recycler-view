export interface IEvents {
  on(key: string, handler: (...args: any[]) => void): IEvents;
  emit(key: string): IEvents;
  off(...keys: string[]): IEvents;
}
