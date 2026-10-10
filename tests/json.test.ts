import { describe, it, expect } from 'vitest';

import {
  createJsonReport,
  formatJsonReport,
  formatJsonError,
} from '../src/reporters/json';

import { compareEnv } from '../src/core/compare';
import type { ComparisonResult } from '../src/types';

describe('JSON Reporter', () => {
  it('should create a successful report', () => {
    const result: ComparisonResult = {
      valid: ['APP_NAME', 'PORT'],
      missing: [],
      empty: [],
      undocumented: [],
    };

    const report = createJsonReport(result);

    expect(report.schemaVersion).toBe(1);
    expect(report.status).toBe('passed');
    expect(report.summary.valid).toBe(2);
    expect(report.summary.errors).toBe(0);
  });

  it('should count errors correctly', () => {
    const result: ComparisonResult = {
      valid: ['APP_NAME'],
      missing: ['DATABASE_URL'],
      empty: ['API_KEY'],
      undocumented: [],
    };

    const report = createJsonReport(result);

    expect(report.status).toBe('failed');
    expect(report.summary.errors).toBe(2);
    expect(report.summary.missing).toBe(1);
    expect(report.summary.empty).toBe(1);
  });

  it('should treat undocumented variables as warnings', () => {
    const result: ComparisonResult = {
      valid: ['APP_NAME'],
      missing: [],
      empty: [],
      undocumented: ['DEBUG_MODE'],
    };

    const report = createJsonReport(result);

    expect(report.status).toBe('passed');
    expect(report.summary.errors).toBe(0);
    expect(report.summary.warnings).toBe(1);
  });

  it('should never expose environment values', () => {
    const actual = {
      DATABASE_URL: 'postgresql://admin:super-secret@localhost/db',
      API_KEY: 'my-private-api-key',
    };

    const example = {
      DATABASE_URL: 'placeholder',
      API_KEY: 'placeholder',
    };

    const comparison = compareEnv(actual, example);
    const output = formatJsonReport(comparison);

    expect(output).toContain('DATABASE_URL');
    expect(output).toContain('API_KEY');

    expect(output).not.toContain('super-secret');
    expect(output).not.toContain('my-private-api-key');
  });

  it('should create a safe JSON error report', () => {
    const output = formatJsonError();
    const report = JSON.parse(output);

    expect(report.status).toBe('error');
    expect(report.error.code).toBe('FILE_READ_ERROR');
    expect(report.schemaVersion).toBe(1);
  });
});
