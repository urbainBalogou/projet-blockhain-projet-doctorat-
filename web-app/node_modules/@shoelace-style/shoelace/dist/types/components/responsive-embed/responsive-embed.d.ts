/**
 * @since 2.0
 * @status stable
 *
 * @part base - The component's base wrapper.
 */
export declare class ResponsiveEmbed {
  base: HTMLElement;
  /**
   * The aspect ratio of the embedded media in the format of `width:height`, e.g. `16:9`, `4:3`, or `1:1`. Ratios not in
   * this format will be ignored.
   */
  aspectRatio: string;
  handleAspectRatioChange(): void;
  connectedCallback(): void;
  handleSlotChange(): void;
  setAspectRatio(): void;
  render(): any;
}
