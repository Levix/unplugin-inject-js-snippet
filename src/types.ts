export type InjectTypes = 'js' | 'html';

export type Options<Inject extends InjectTypes = 'html'> = Inject extends 'js'
    ? {
          inject: Inject;
          templates: string[];
          injectTag?: string;
          injectJs: string;
      }
    : {
          inject: Inject;
          templates?: string[];
          injectJs: string;
      };
