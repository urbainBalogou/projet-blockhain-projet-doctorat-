import { EventEmitter } from '../../stencil-public-runtime';
/**
 * @since 2.0
 * @status stable
 *
 * @slot - The checkbox's label.
 *
 * @part base - The component's base wrapper.
 * @part control - The checkbox control.
 * @part checked-icon - The container the wraps the checked icon.
 * @part indeterminate-icon - The container that wraps the indeterminate icon.
 * @part label - The checkbox label.
 */
export declare class Checkbox {
  inputId: string;
  labelId: string;
  input: HTMLInputElement;
  hasFocus: boolean;
  /** The checkbox's name attribute. */
  name: string;
  /** The checkbox's value attribute. */
  value: string;
  /** Set to true to disable the checkbox. */
  disabled: boolean;
  /** Set to true to make the checkbox a required field. */
  required: boolean;
  /** Set to true to draw the checkbox in a checked state. */
  checked: boolean;
  /** Set to true to draw the checkbox in an indeterminate state. */
  indeterminate: boolean;
  /** This will be true when the control is in an invalid state. Validity is determined by the `required` prop. */
  invalid: boolean;
  /** Emitted when the control loses focus. */
  slBlur: EventEmitter;
  /** Emitted when the control's checked state changes. */
  slChange: EventEmitter;
  /** Emitted when the control gains focus. */
  slFocus: EventEmitter;
  handleCheckedChange(): void;
  connectedCallback(): void;
  componentDidLoad(): void;
  /** Sets focus on the checkbox. */
  setFocus(): Promise<void>;
  /** Removes focus from the checkbox. */
  removeFocus(): Promise<void>;
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity(): Promise<boolean>;
  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  setCustomValidity(message: string): Promise<void>;
  handleClick(): void;
  handleBlur(): void;
  handleFocus(): void;
  handleMouseDown(event: MouseEvent): void;
  render(): any;
}
