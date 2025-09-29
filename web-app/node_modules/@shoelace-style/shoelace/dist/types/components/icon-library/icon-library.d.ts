import { IconLibraryResolver, IconLibraryMutator } from './icon-library-registry';
/**
 * @since 2.0
 * @status stable
 */
export declare class IconLibrary {
  /** The name of the icon library. */
  name: string;
  /**
   * A function that translates an icon name to a URL where the corresponding SVG file exists The URL can be local or a
   * CORS-enabled endpoint.
   */
  resolver: IconLibraryResolver;
  /** A function that mutates the SVG element before it renders. */
  mutator: IconLibraryMutator;
  handleUpdate(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  register(): void;
  render(): any;
}
