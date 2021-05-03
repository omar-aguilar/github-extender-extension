export type ContentScriptOptions = {
  selector?: string;
};

export type RegisterOptions = {
  background?: BackgroundFn;
  contentScript?: ContentScriptBGFn;
  contentScriptOptions?: ContentScriptOptions;
};

export type RegisterFn = (options: RegisterOptions) => void;
export type BackgroundFn = () => void;
export type SendMessageFn<T> = (data: T) => void;
export type ContentScriptBGFn = (send: SendMessageFn<any>) => void;
export type ContentScriptUIFn = (elem: Element) => void;

export type PluginDefinition = (register: RegisterFn) => void;
