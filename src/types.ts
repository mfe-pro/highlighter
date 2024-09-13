export interface HighlightOptions {
  org: string;
  primaryColor?: string;
  secondaryColor?: string;
}

declare global {
  interface Window {
    MFEHighlighter: {
      init: (options?: HighlightOptions) => void;
    };
  }
}