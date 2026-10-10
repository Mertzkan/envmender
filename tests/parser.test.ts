import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';

import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { readEnvFile } from '../src/core/parser';

describe('readEnvFile', () => {
  let testDirectory: string;

  beforeEach(() => {
    testDirectory = mkdtempSync(join(tmpdir(), 'envmender-test-'));
  });

  afterEach(() => {
    rmSync(testDirectory, {
      recursive: true,
      force: true,
    });
  });

  it('should parse standard environment variables', () => {
    const filePath = join(testDirectory, '.env');

    writeFileSync(filePath, 'APP_NAME=EnvMender\nPORT=3000');

    const result = readEnvFile(filePath);

    expect(result).toEqual({
      APP_NAME: 'EnvMender',
      PORT: '3000',
    });
  });

  it('should ignore comments and blank lines', () => {
    const filePath = join(testDirectory, '.env');

    writeFileSync(
      filePath,
      `
# Application configuration

APP_NAME=EnvMender

# Server configuration
PORT=3000
`,
    );

    const result = readEnvFile(filePath);

    expect(result).toEqual({
      APP_NAME: 'EnvMender',
      PORT: '3000',
    });
  });

  it('should parse quoted values with equals signs', () => {
    const filePath = join(testDirectory, '.env');

    writeFileSync(filePath, 'API_KEY="abc=123=xyz"\nAPP_NAME="My App"');

    const result = readEnvFile(filePath);

    expect(result).toEqual({
      API_KEY: 'abc=123=xyz',
      APP_NAME: 'My App',
    });
  });

  it('should recognize empty values', () => {
    const filePath = join(testDirectory, '.env');

    writeFileSync(filePath, 'API_KEY=\nDATABASE_URL=');

    const result = readEnvFile(filePath);

    expect(result).toEqual({
      API_KEY: '',
      DATABASE_URL: '',
    });
  });

  it('should throw an error for a missing file', () => {
    const filePath = join(testDirectory, 'does-not-exist.env');

    expect(() => readEnvFile(filePath)).toThrow();
  });

  it('should not modify process.env', () => {
    const filePath = join(testDirectory, '.env');

    const key = 'ENVMENDER_TEST_PRIVATE_VARIABLE';
    const previousValue = process.env[key];

    writeFileSync(filePath, `${key}=example-secret`);

    const result = readEnvFile(filePath);

    expect(result[key]).toBe('example-secret');
    expect(process.env[key]).toBe(previousValue);
  });
});
