import { EventEmitter } from '../../stencil-public-runtime';
/**
 * @since 2.0
 * @status stable
 *
 * @part base - The component's base wrapper.
 */
export declare class Rating {
  rating: HTMLElement;
  host: HTMLSlRatingElement;
  hoverValue: number;
  isHovering: boolean;
  /** The current rating. */
  value: number;
  /** The highest rating to show. */
  max: number;
  /** The minimum increment value allowed by the control. */
  precision: number;
  /** Makes the rating readonly. */
  readonly: boolean;
  /** Disables the rating. */
  disabled: boolean;
  /** A function that returns the symbols to display. Accepts an option `value` parameter you can use to map a specific
   * symbol to a value. */
  getSymbol: (value?: number) => string;
  handleValueChange(): void;
  /** Emitted when the rating's value changes. */
  slChange: EventEmitter;
  connectedCallback(): void;
  /** Sets focus on the rating. */
  setFocus(): Promise<void>;
  /** Removes focus from the rating. */
  removeFocus(): Promise<void>;
  componentDidLoad(): void;
  disconnectedCallback(): void;
  getValueFromMousePosition(event: MouseEvent): number;
  handleClick(event: MouseEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleMouseEnter(): void;
  handleMouseLeave(): void;
  handleMouseMove(event: MouseEvent): void;
  roundToPrecision(numberToRound: number, precision?: number): number;
  render(): any;
}
