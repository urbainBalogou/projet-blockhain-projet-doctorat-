/**
 * @since 2.0
 * @status stable
 *
 * @slot - A label to show inside the ring.
 *
 * @part base - The component's base wrapper.
 * @part label - The progress ring label.
 */
export declare class Progress {
  indicator: SVGCircleElement;
  /** The size of the progress ring in pixels. */
  size: number;
  /** The stroke width of the progress ring in pixels. */
  strokeWidth: number;
  /** The current progress percentage, 0 - 100. */
  percentage: number;
  handlePercentageChange(): void;
  componentDidLoad(): void;
  updateProgress(): void;
  render(): any;
}
