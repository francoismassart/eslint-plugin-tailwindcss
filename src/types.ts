export interface PluginSharedSettings {
  /**
   * @description Path to the CSS stylesheet in your Tailwind project (v4+)
   * @example "src/styles/tailwind.css"
   */
  stylesheet?: string;
  /**
   * @description Path to Tailwind configuration file
   * @example "tailwind.config.js"
   */
  config?: string;
  /**
   * @description List of attributes/props that contain sortable Tailwind classes
   * @default []
   * @example ["className"]
   */
  attributes?: Array<string>;
  /**
   * @description List of functions and tagged templates that contain sortable Tailwind classes
   * @default []
   * @example ["clsx", "tw", "ctl"]
   */
  functions?: Array<string>;
  /**
   * @description Preserve whitespace around Tailwind classes when sorting
   * @default false
   */
  preserveWhitespace?: boolean;
  /**
   * @description Preserve duplicate classes inside a class list when sorting
   * @default false
   */
  preserveDuplicates?: boolean;
}
export interface SharedConfigurationSettings {
  tailwindcss?: PluginSharedSettings;
}
