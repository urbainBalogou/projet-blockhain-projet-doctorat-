/**
 * @since 2.0
 * @status stable
 *
 * @slot - The tab panel's content.
 *
 * @part base - The component's base wrapper.
 */
export declare class TabPanel {
  componentId: string;
  host: HTMLSlTabPanelElement;
  /** The tab panel's name. */
  name: string;
  /** When true, the tab panel will be shown. */
  active: boolean;
  render(): any;
}
