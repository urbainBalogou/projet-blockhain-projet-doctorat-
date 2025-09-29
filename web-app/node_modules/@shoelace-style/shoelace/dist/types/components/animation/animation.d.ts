import { EventEmitter } from '../../stencil-public-runtime';
/**
 * @since 2.0
 * @status stable
 *
 * @slot - The element to animate. If multiple elements are to be animated, wrap them in a single container.
 */
export declare class Animate {
  animation: Animation;
  hasStarted: boolean;
  host: HTMLSlAnimationElement;
  /** The name of the animation to use. */
  name: string;
  /** The number of milliseconds to delay the start of the animation. */
  delay: number;
  /** Determines the direction of playback as well as the behavior when reaching the end of an iteration. */
  direction: PlaybackDirection;
  /** The number of milliseconds each iteration of the animation takes to complete. */
  duration: number;
  /** The rate of the animation's change over time. */
  easing: string;
  /** The number of milliseconds to delay after the active period of an animation sequence. */
  endDelay: number;
  /** Sets how the animation applies styles to its target before and after its execution. */
  fill: FillMode;
  /** The number of iterations to run before the animation completes. Defaults to `Infinity`, which loops. */
  iterations: number;
  /** The offset at which to start the animation, usually between 0 (start) and 1 (end). */
  iterationStart: number;
  /** The keyframes to use for the animation. If this is set, `name` will be ignored. */
  keyframes: Keyframe[];
  /**
   * Sets the animation's playback rate. The default is `1`, which plays the animation at a normal speed. Setting this
   * to `2`, for example, will double the animation's speed. A negative value can be used to reverse the animation. This
   * value can be changed without causing the animation to restart.
   */
  playbackRate: number;
  /** Pauses the animation. The animation will resume when this prop is removed. */
  pause: boolean;
  handleRestartAnimation(): void;
  handlePauseChange(): void;
  handlePlaybackRateChange(): void;
  /** Emitted when the animation is canceled. */
  slCancel: EventEmitter;
  /** Emitted when the animation finishes. */
  slFinish: EventEmitter;
  /** Emitted when the animation starts or restarts. */
  slStart: EventEmitter;
  connectedCallback(): void;
  componentDidLoad(): void;
  disconnectedCallback(): void;
  handleAnimationFinish(): void;
  handleAnimationCancel(): void;
  handleSlotChange(): void;
  createAnimation(): void;
  destroyAnimation(): void;
  /** Clears all KeyframeEffects caused by this animation and aborts its playback. */
  cancel(): Promise<void>;
  /** Sets the playback time to the end of the animation corresponding to the current playback direction. */
  finish(): Promise<void>;
  /** Gets a list of all supported animation names. */
  getAnimationNames(): Promise<string[]>;
  /** Gets a list of all supported easing function names. */
  getEasingNames(): Promise<string[]>;
  /** Gets the current time of the animation in milliseconds. */
  getCurrentTime(): Promise<number>;
  /** Sets the current time of the animation in milliseconds. */
  setCurrentTime(time: number): Promise<void>;
  render(): any;
}
