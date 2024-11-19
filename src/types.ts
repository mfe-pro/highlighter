export interface HighlightOptions {
  org: string;
  barColor?: string;
  fontColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  buttonActiveColor?: string;
  buttonInactiveColor?: string;
  iconActiveColor?: string;
  iconInactiveColor?: string;
}

declare global {
  interface Window {
    MFEHighlighter: {
      init: (options?: HighlightOptions) => void;
      destroy: () => void;
    };
    MFEHighlighterConfig: HighlightOptions
  }
}