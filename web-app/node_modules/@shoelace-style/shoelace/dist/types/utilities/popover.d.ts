import { Instance as PopperInstance } from '@popperjs/core';
export default class Popover {
  anchor: HTMLElement;
  isVisible: boolean;
  popover: HTMLElement;
  popper: PopperInstance;
  options: PopoverOptions;
  constructor(anchor: HTMLElement, popover: HTMLElement, options?: PopoverOptions);
  private handleTransitionEnd;
  destroy(): void;
  show(): void;
  hide(): void;
  setOptions(options: PopoverOptions): void;
}
interface PopoverOptions {
  distance?: number;
  placement?: 'auto' | 'auto-start' | 'auto-end' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
  skidding?: number;
  strategy?: 'absolute' | 'fixed';
  transitionElement?: HTMLElement;
  visibleClass?: string;
  onAfterShow?: () => any;
  onAfterHide?: () => any;
  onTransitionEnd?: (event: TransitionEvent) => any;
}
export {};
