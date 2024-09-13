import {initMFEHighlighter} from "./highlighter";

export interface HighlightOptions {
  org: string;
  primaryColor?: string;
  secondaryColor?: string;
}

declare global {
  interface Window {
    MFEHighlighter: {
      initMFEHighlighter: (options?: HighlightOptions) => void;
    };
  }
}