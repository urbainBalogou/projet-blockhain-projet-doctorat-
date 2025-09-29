/* Shoelace custom elements bundle */

import { Components, JSX } from "../types/components";

interface SlAlert extends Components.SlAlert, HTMLElement {}
export const SlAlert: {
  prototype: SlAlert;
  new (): SlAlert;
};

interface SlAnimation extends Components.SlAnimation, HTMLElement {}
export const SlAnimation: {
  prototype: SlAnimation;
  new (): SlAnimation;
};

interface SlAvatar extends Components.SlAvatar, HTMLElement {}
export const SlAvatar: {
  prototype: SlAvatar;
  new (): SlAvatar;
};

interface SlBadge extends Components.SlBadge, HTMLElement {}
export const SlBadge: {
  prototype: SlBadge;
  new (): SlBadge;
};

interface SlButton extends Components.SlButton, HTMLElement {}
export const SlButton: {
  prototype: SlButton;
  new (): SlButton;
};

interface SlButtonGroup extends Components.SlButtonGroup, HTMLElement {}
export const SlButtonGroup: {
  prototype: SlButtonGroup;
  new (): SlButtonGroup;
};

interface SlCard extends Components.SlCard, HTMLElement {}
export const SlCard: {
  prototype: SlCard;
  new (): SlCard;
};

interface SlCheckbox extends Components.SlCheckbox, HTMLElement {}
export const SlCheckbox: {
  prototype: SlCheckbox;
  new (): SlCheckbox;
};

interface SlColorPicker extends Components.SlColorPicker, HTMLElement {}
export const SlColorPicker: {
  prototype: SlColorPicker;
  new (): SlColorPicker;
};

interface SlDetails extends Components.SlDetails, HTMLElement {}
export const SlDetails: {
  prototype: SlDetails;
  new (): SlDetails;
};

interface SlDialog extends Components.SlDialog, HTMLElement {}
export const SlDialog: {
  prototype: SlDialog;
  new (): SlDialog;
};

interface SlDrawer extends Components.SlDrawer, HTMLElement {}
export const SlDrawer: {
  prototype: SlDrawer;
  new (): SlDrawer;
};

interface SlDropdown extends Components.SlDropdown, HTMLElement {}
export const SlDropdown: {
  prototype: SlDropdown;
  new (): SlDropdown;
};

interface SlForm extends Components.SlForm, HTMLElement {}
export const SlForm: {
  prototype: SlForm;
  new (): SlForm;
};

interface SlFormatBytes extends Components.SlFormatBytes, HTMLElement {}
export const SlFormatBytes: {
  prototype: SlFormatBytes;
  new (): SlFormatBytes;
};

interface SlFormatDate extends Components.SlFormatDate, HTMLElement {}
export const SlFormatDate: {
  prototype: SlFormatDate;
  new (): SlFormatDate;
};

interface SlFormatNumber extends Components.SlFormatNumber, HTMLElement {}
export const SlFormatNumber: {
  prototype: SlFormatNumber;
  new (): SlFormatNumber;
};

interface SlIcon extends Components.SlIcon, HTMLElement {}
export const SlIcon: {
  prototype: SlIcon;
  new (): SlIcon;
};

interface SlIconButton extends Components.SlIconButton, HTMLElement {}
export const SlIconButton: {
  prototype: SlIconButton;
  new (): SlIconButton;
};

interface SlIconLibrary extends Components.SlIconLibrary, HTMLElement {}
export const SlIconLibrary: {
  prototype: SlIconLibrary;
  new (): SlIconLibrary;
};

interface SlImageComparer extends Components.SlImageComparer, HTMLElement {}
export const SlImageComparer: {
  prototype: SlImageComparer;
  new (): SlImageComparer;
};

interface SlInclude extends Components.SlInclude, HTMLElement {}
export const SlInclude: {
  prototype: SlInclude;
  new (): SlInclude;
};

interface SlInput extends Components.SlInput, HTMLElement {}
export const SlInput: {
  prototype: SlInput;
  new (): SlInput;
};

interface SlMenu extends Components.SlMenu, HTMLElement {}
export const SlMenu: {
  prototype: SlMenu;
  new (): SlMenu;
};

interface SlMenuDivider extends Components.SlMenuDivider, HTMLElement {}
export const SlMenuDivider: {
  prototype: SlMenuDivider;
  new (): SlMenuDivider;
};

interface SlMenuItem extends Components.SlMenuItem, HTMLElement {}
export const SlMenuItem: {
  prototype: SlMenuItem;
  new (): SlMenuItem;
};

interface SlMenuLabel extends Components.SlMenuLabel, HTMLElement {}
export const SlMenuLabel: {
  prototype: SlMenuLabel;
  new (): SlMenuLabel;
};

interface SlProgressBar extends Components.SlProgressBar, HTMLElement {}
export const SlProgressBar: {
  prototype: SlProgressBar;
  new (): SlProgressBar;
};

interface SlProgressRing extends Components.SlProgressRing, HTMLElement {}
export const SlProgressRing: {
  prototype: SlProgressRing;
  new (): SlProgressRing;
};

interface SlRadio extends Components.SlRadio, HTMLElement {}
export const SlRadio: {
  prototype: SlRadio;
  new (): SlRadio;
};

interface SlRange extends Components.SlRange, HTMLElement {}
export const SlRange: {
  prototype: SlRange;
  new (): SlRange;
};

interface SlRating extends Components.SlRating, HTMLElement {}
export const SlRating: {
  prototype: SlRating;
  new (): SlRating;
};

interface SlRelativeTime extends Components.SlRelativeTime, HTMLElement {}
export const SlRelativeTime: {
  prototype: SlRelativeTime;
  new (): SlRelativeTime;
};

interface SlResizeObserver extends Components.SlResizeObserver, HTMLElement {}
export const SlResizeObserver: {
  prototype: SlResizeObserver;
  new (): SlResizeObserver;
};

interface SlResponsiveEmbed extends Components.SlResponsiveEmbed, HTMLElement {}
export const SlResponsiveEmbed: {
  prototype: SlResponsiveEmbed;
  new (): SlResponsiveEmbed;
};

interface SlSelect extends Components.SlSelect, HTMLElement {}
export const SlSelect: {
  prototype: SlSelect;
  new (): SlSelect;
};

interface SlSkeleton extends Components.SlSkeleton, HTMLElement {}
export const SlSkeleton: {
  prototype: SlSkeleton;
  new (): SlSkeleton;
};

interface SlSpinner extends Components.SlSpinner, HTMLElement {}
export const SlSpinner: {
  prototype: SlSpinner;
  new (): SlSpinner;
};

interface SlSwitch extends Components.SlSwitch, HTMLElement {}
export const SlSwitch: {
  prototype: SlSwitch;
  new (): SlSwitch;
};

interface SlTab extends Components.SlTab, HTMLElement {}
export const SlTab: {
  prototype: SlTab;
  new (): SlTab;
};

interface SlTabGroup extends Components.SlTabGroup, HTMLElement {}
export const SlTabGroup: {
  prototype: SlTabGroup;
  new (): SlTabGroup;
};

interface SlTabPanel extends Components.SlTabPanel, HTMLElement {}
export const SlTabPanel: {
  prototype: SlTabPanel;
  new (): SlTabPanel;
};

interface SlTag extends Components.SlTag, HTMLElement {}
export const SlTag: {
  prototype: SlTag;
  new (): SlTag;
};

interface SlTextarea extends Components.SlTextarea, HTMLElement {}
export const SlTextarea: {
  prototype: SlTextarea;
  new (): SlTextarea;
};

interface SlTheme extends Components.SlTheme, HTMLElement {}
export const SlTheme: {
  prototype: SlTheme;
  new (): SlTheme;
};

interface SlTooltip extends Components.SlTooltip, HTMLElement {}
export const SlTooltip: {
  prototype: SlTooltip;
  new (): SlTooltip;
};

/**
 * Utility to define all custom elements within this package using the tag name provided in the component's source. 
 * When defining each custom element, it will also check it's safe to define by:
 *
 * 1. Ensuring the "customElements" registry is available in the global context (window).
 * 2. The component tag name is not already defined.
 *
 * Use the standard [customElements.define()](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) 
 * method instead to define custom elements individually, or to provide a different tag name.
 */
export declare const defineCustomElements: (opts?: any) => void;

/**
 * Used to manually set the base path where assets can be found.
 * If the script is used as "module", it's recommended to use "import.meta.url",
 * such as "setAssetPath(import.meta.url)". Other options include
 * "setAssetPath(document.currentScript.src)", or using a bundler's replace plugin to
 * dynamically set the path at build time, such as "setAssetPath(process.env.ASSET_PATH)".
 * But do note that this configuration depends on how your script is bundled, or lack of
 * bunding, and where your assets can be loaded from. Additionally custom bundling
 * will have to ensure the static assets are copied to its build directory.
 */
export declare const setAssetPath: (path: string) => void;

export { Components, JSX };

export * from '../types';
