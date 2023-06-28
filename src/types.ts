export type InjectTypes = 'js' | 'html';

export type Options<Inject extends InjectTypes = 'html'> = Inject extends 'js'
    ? {
          /**
           * Injection type.
           */
          inject: Inject;
          /**
           * Set the file path of the JS file to be injected.
           */
          templates: string[];
          /**
           * Supports inserting tags.
           */
          injectTag?: string;
          /**
           * Injecting JS content into JS.
           */
          injectJs: string;
      }
    : {
          /**
           * Injection type.
           */
          inject: Inject;
          /**
           * Set the file path of the HTML file to be injected.
           */
          templates?: string[];
          /**
           * Injecting JS content into HTML.
           */
          injectJs: string;
          /**
           * Inject JavaScript code snippets into an HTML page. If set to false, it indicates injecting script tags with files.
           * @default true
           */
          injectSnippet?: boolean;
      };
