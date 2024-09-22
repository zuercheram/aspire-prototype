export type ContentConfig =
  | {
      type: "string";
    }
  | NumberContentConfig
  | LookupContentConfig
  | DateContentConfig
  | DateTimeContentConfig;

export interface NumberContentConfig {
  type: "number";
  decimals?: number;
}

export interface LookupContentConfig {
  type: "lookup";
  inputOutputMap: Record<string, string>;
}

export interface DateContentConfig {
  type: "date";
}
export interface DateTimeContentConfig {
  type: "dateTime";
}

export const getAlignmentByContentConfig = (
  contentConfig?: ContentConfig
): "left" | "right" => {
  if (contentConfig == null) {
    return "left";
  }
  if (contentConfig?.type === "number") {
    return "right";
  }
  return "left";
};
