/**
 * @since 2.0
 * @status stable
 *
 * @slot - The badge's content.
 *
 * @part base - The base wrapper
 */
export declare class Badge {
  badge: HTMLElement;
  /** The badge's type. */
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text';
  /** Set to true to draw a pill-style badge with rounded edges. */
  pill: boolean;
  /** Set to true to make the badge pulsate to draw attention. */
  pulse: boolean;
  render(): any;
}
