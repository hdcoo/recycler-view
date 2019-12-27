export enum ImageTypes {
  img = 'img',
  background = 'background'
}

export interface ILazyLoaderOptions {
  speedThreshold?: number;
  loading?: string;
  error?: string;
}

export interface IBinding {
  value: string;
  type?: ImageTypes;
}

export interface ILoader extends Promise<void> {
  cancel?(): void;
}

export interface IElementInfo {
  loader?: ILoader;
  binding?: IBinding;
  render?(): void;
}

export interface IPlaceholders {
  loading: string;
  error: string;
}

export interface IHTMLElement extends HTMLElement {
  [key: string]: any;
}
