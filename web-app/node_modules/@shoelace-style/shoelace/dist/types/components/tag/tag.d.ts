import { EventEmitter } from '../../stencil-public-runtime';
/**
 * @since 2.0
 * @status stable
 *
 * @slot - The tag's content.
 *
 * @part base - The component's base wrapper.
 * @part content - The tag content.
 * @part clear-button - The clear button.
 */
export declare class Tag {
  tag: HTMLElement;
  /** The tag's type. */
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text';
  /** The tag's size. */
  size: 'small' | 'medium' | 'large';
  /** Set to true to draw a pill-style tag with rounded edges. */
  pill: boolean;
  /** Set to true to make the tag clearable. */
  clearable: boolean;
  /** Emitted when the clear button is activated. */
  slClear: EventEmitter;
  connectedCallback(): void;
  handleClearClick(): void;
  render(): any;
}
