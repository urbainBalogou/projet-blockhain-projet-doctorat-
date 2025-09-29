import { EventEmitter } from '../../stencil-public-runtime';
/**
 * @since 2.0
 * @status stable
 *
 * @slot - The switch's label.
 *
 * @part base - The component's base wrapper.
 * @part control - The switch control.
 * @part thumb - The switch position indicator.
 * @part label - The switch label.
 */
export declare class Switch {
  switchId: string;
  labelId: string;
  input: HTMLInputElement;
  hasFocus: boolean;
  /** The switch's name attribute. */
  name: string;
  /** The switch's value attribute. */
  value: string;
  /** Set to true to disable the switch. */
  disabled: boolean;
  /** Set to true to make the switch a required field. */
  required: boolean;
  /** Set to true to draw the switch in a checked state. */
  checked: boolean;
  /** This will be true when the control is in an invalid state. Validity is determined by the `required` prop. */
  invalid: boolean;
  handleCheckedChange(): void;
  /** Emitted when the control loses focus. */
  slBlur: EventEmitter;
  /** Emitted when the control's checked state changes. */
  slChange: EventEmitter;
  /** Emitted when the control gains focus. */
  slFocus: EventEmitter;
  connectedCallback(): void;
  /** Sets focus on the switch. */
  setFocus(): Promise<void>;
  /** Removes focus from the switch. */
  removeFocus(): Promise<void>;
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity(): Promise<boolean>;
  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  setCustomValidity(message: string): Promise<void>;
  handleClick(): void;
  handleBlur(): void;
  handleFocus(): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleMouseDown(event: MouseEvent): void;
  render(): any;
}
