import type { EnvVariables, ComparisonResult } from '../types.js';

export function compareEnv(
  actual: EnvVariables,
  example: EnvVariables,
): ComparisonResult {
  const result: ComparisonResult = {
    missing: [],
    empty: [],
    undocumented: [],
    valid: [],
  };

  // Check variables required by the example file
  for (const key of Object.keys(example)) {
    if (!Object.hasOwn(actual, key)) {
      result.missing.push(key);
      continue;
    }

    if (actual[key].trim() === '') {
      result.empty.push(key);
      continue;
    }

    result.valid.push(key);
  }

  // Find variables not documented in the example file
  for (const key of Object.keys(actual)) {
    if (!Object.hasOwn(example, key)) {
      result.undocumented.push(key);
    }
  }

  // Keep output predictable
  result.missing.sort();
  result.empty.sort();
  result.undocumented.sort();
  result.valid.sort();

  return result;
}
