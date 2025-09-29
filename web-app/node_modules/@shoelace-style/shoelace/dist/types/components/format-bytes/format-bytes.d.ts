/**
 * @since 2.0
 * @status stable
 */
export declare class FormatBytes {
  /** The number to format in bytes. */
  value: number;
  /** The unit to display. */
  unit: 'bytes' | 'bits';
  /** The locale to use when formatting the number. */
  locale: string;
  render(): string;
}
