export type EnvVariables = Record<string, string>;

export interface ComparisonResult {
  missing: string[];
  empty: string[];
  undocumented: string[];
  valid: string[];
}
