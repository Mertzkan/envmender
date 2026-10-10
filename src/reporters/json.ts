import type { ComparisonResult } from '../types.js';

export interface JsonReport {
  schemaVersion: 1;
  status: 'passed' | 'failed';
  summary: {
    valid: number;
    missing: number;
    empty: number;
    undocumented: number;
    errors: number;
    warnings: number;
  };
  variables: ComparisonResult;
}

export function createJsonReport(result: ComparisonResult): JsonReport {
  const errors = result.missing.length + result.empty.length;

  const warnings = result.undocumented.length;

  return {
    schemaVersion: 1,
    status: errors > 0 ? 'failed' : 'passed',

    summary: {
      valid: result.valid.length,
      missing: result.missing.length,
      empty: result.empty.length,
      undocumented: result.undocumented.length,
      errors,
      warnings,
    },

    variables: {
      valid: result.valid,
      missing: result.missing,
      empty: result.empty,
      undocumented: result.undocumented,
    },
  };
}

export function formatJsonReport(result: ComparisonResult): string {
  const report = createJsonReport(result);

  return JSON.stringify(report, null, 2);
}

export function formatJsonError(): string {
  return JSON.stringify(
    {
      schemaVersion: 1,
      status: 'error',
      error: {
        code: 'FILE_READ_ERROR',
        message:
          'Could not read environment files. Check paths and permissions.',
      },
    },
    null,
    2,
  );
}
