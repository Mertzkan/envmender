import { describe, it, expect } from 'vitest';

import { formatTerminalReport } from '../src/reporters/terminal';
import type { ComparisonResult } from '../src/types';

describe('formatTerminalReport', () => {
  it('should display a successful validation', () => {
    const result: ComparisonResult = {
      missing: [],
      empty: [],
      undocumented: [],
      valid: ['APP_NAME', 'PORT'],
    };

    const output = formatTerminalReport(result, false);

    expect(output).toContain('Validation passed');
    expect(output).toContain('Valid:        2');
    expect(output).toContain('0 error(s), 0 warning(s)');
  });

  it('should display missing and empty variables', () => {
    const result: ComparisonResult = {
      missing: ['DATABASE_URL'],
      empty: ['API_KEY'],
      undocumented: [],
      valid: ['APP_NAME'],
    };

    const output = formatTerminalReport(result, false);

    expect(output).toContain('Validation failed');
    expect(output).toContain('DATABASE_URL');
    expect(output).toContain('API_KEY');
    expect(output).toContain('2 error(s), 0 warning(s)');
  });

  it('should treat undocumented variables as warnings', () => {
    const result: ComparisonResult = {
      missing: [],
      empty: [],
      undocumented: ['DEBUG_MODE'],
      valid: ['APP_NAME'],
    };

    const output = formatTerminalReport(result, false);

    expect(output).toContain('Validation passed');
    expect(output).toContain('DEBUG_MODE');
    expect(output).toContain('0 error(s), 1 warning(s)');
  });

  it('should not include ANSI colors when disabled', () => {
    const result: ComparisonResult = {
      missing: [],
      empty: [],
      undocumented: [],
      valid: [],
    };

    const output = formatTerminalReport(result, false);

    expect(output).not.toMatch(/\x1b\[[0-9;]*m/);
  });

  it('should add ANSI colors when enabled', () => {
    const result: ComparisonResult = {
      missing: [],
      empty: [],
      undocumented: [],
      valid: ['APP_NAME'],
    };

    const output = formatTerminalReport(result, true);

    expect(output).toMatch(/\x1b\[[0-9;]*m/);
  });
});
