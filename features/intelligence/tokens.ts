export const designSystemMeta = {
  name: "intelligence",
  source: "Pending — resource not yet provided",
  status: "Placeholder. Waiting on a Figma frame or other resource before any tokens are populated.",
  figmaNode: null,
} as const;

export const colorTokens: ReadonlyArray<{
  name: string;
  value: string;
  nodeId?: string;
}> = [];

export const typographyTokens: ReadonlyArray<{
  name: string;
  sample: string;
  fontFamily: string;
  size: string;
  lineHeight: string;
  weight: string;
  letterSpacing: string;
  color: string;
  nodeId?: string;
}> = [];

export type ColorToken = (typeof colorTokens)[number];
export type TypographyToken = (typeof typographyTokens)[number];
