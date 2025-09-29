/**
 * @since 2.0
 * @status stable
 *
 * @slot icon - The default icon to use when no image or initials are present.
 *
 * @part base - The component's base wrapper.
 * @part icon - The container that wraps the avatar icon.
 * @part initials - The container that wraps the avatar initials.
 * @part image - The avatar image.
 */
export declare class Avatar {
  hasError: boolean;
  /** The image source to use for the avatar. */
  image: string;
  /** Alternative text for the image. */
  alt: string;
  /** Initials to use as a fallback when no image is available (1-2 characters max recommended). */
  initials: string;
  /** The shape of the avatar. */
  shape: 'circle' | 'square' | 'rounded';
  connectedCallback(): void;
  handleImageError(): void;
  render(): any;
}
