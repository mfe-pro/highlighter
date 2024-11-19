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
  autoInit?: boolean;
}

declare global {
  interface Window {
    MFEHighlighter: {
      init: (options?: HighlightOptions) => void;
      showButton?: () => void;
      destroy: () => void;
    };
    MFEHighlighterConfig: HighlightOptions
  }
}