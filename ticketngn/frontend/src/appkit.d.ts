declare namespace JSX {
  interface IntrinsicElements {
    "appkit-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      size?: "sm" | "md" | "lg";
      label?: string;
      loadingLabel?: string;
      disabled?: boolean;
    };
  }
}
