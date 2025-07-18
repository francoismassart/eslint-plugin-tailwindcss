export type TailwindConfig = {
  separator?: string;
  prefix?: string;
  content?: {
    files?: Array<string>;
  };
};

export interface DesignSystem {
  getClassOrder: (classes: Array<string>) => Array<[string, bigint | null]>;
  candidatesToCss: (classes: Array<string>) => Array<string | null>;
  tailwindConfig?: TailwindConfig;
}

type ThemeValue = {
  value: string;
  options: number;
  src: string | undefined;
};

export type Theme = {
  prefix: string;
  values: Map<string, ThemeValue>;
  // @ts-expect-error Unexpected any. Specify a different type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyframes: Set<any>;
};
