/**
 * @since 2.0
 * @status stable
 *
 * @slot - One or more `<sl-button>` elements to display in the button group.
 *
 * @part base - The component's base wrapper.
 */
export declare class ButtonGroup {
  buttonGroup: HTMLElement;
  /** A label to use for the button group's `aria-label` attribute. */
  label: string;
  connectedCallback(): void;
  componentDidLoad(): void;
  disconnectedCallback(): void;
  handleFocus(event: CustomEvent): void;
  handleBlur(event: CustomEvent): void;
  render(): any;
}
