/**
 * @since 2.0
 * @status stable
 *
 * @part base - The component's base wrapper.
 * @part indicator - The skeleton's indicator which is responsible for its color and animation.
 */
export declare class Skeleton {
  /** Determines which effect the skeleton will use. */
  effect: 'pulse' | 'sheen' | 'none';
  render(): any;
}
