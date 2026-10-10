import { describe, it, expect } from 'vitest';

import { compareEnv } from '../src/core/compare';
import type { EnvVariables } from '../src/types';

describe('compareEnv', () => {
  it('should recognize valid variables', () => {
    const actual: EnvVariables = {
      APP_NAME: 'EnvMender',
      PORT: '3000',
    };

    const example: EnvVariables = {
      APP_NAME: 'ExampleApp',
      PORT: '8080',
    };

    const result = compareEnv(actual, example);

    expect(result.valid).toEqual(['APP_NAME', 'PORT']);
    expect(result.missing).toEqual([]);
    expect(result.empty).toEqual([]);
    expect(result.undocumented).toEqual([]);
  });

  it('should detect missing variables', () => {
    const actual: EnvVariables = {
      APP_NAME: 'EnvMender',
    };

    const example: EnvVariables = {
      APP_NAME: 'ExampleApp',
      DATABASE_URL: 'placeholder',
    };

    const result = compareEnv(actual, example);

    expect(result.missing).toEqual(['DATABASE_URL']);
    expect(result.valid).toEqual(['APP_NAME']);
  });

  it('should detect empty variables', () => {
    const actual: EnvVariables = {
      API_KEY: '',
    };

    const example: EnvVariables = {
      API_KEY: 'placeholder',
    };

    const result = compareEnv(actual, example);

    expect(result.empty).toEqual(['API_KEY']);
    expect(result.missing).toEqual([]);
  });

  it('should treat whitespace-only values as empty', () => {
    const actual: EnvVariables = {
      API_KEY: '   ',
    };

    const example: EnvVariables = {
      API_KEY: 'placeholder',
    };

    const result = compareEnv(actual, example);

    expect(result.empty).toEqual(['API_KEY']);
  });

  it('should detect undocumented variables', () => {
    const actual: EnvVariables = {
      APP_NAME: 'EnvMender',
      DEBUG_MODE: 'true',
    };

    const example: EnvVariables = {
      APP_NAME: 'ExampleApp',
    };

    const result = compareEnv(actual, example);

    expect(result.undocumented).toEqual(['DEBUG_MODE']);
  });

  it('should allow different values for the same key', () => {
    const actual: EnvVariables = {
      DATABASE_URL: 'postgres://localhost/dev',
    };

    const example: EnvVariables = {
      DATABASE_URL: 'postgres://localhost/example',
    };

    const result = compareEnv(actual, example);

    expect(result.valid).toEqual(['DATABASE_URL']);
  });

  it('should sort results alphabetically', () => {
    const actual: EnvVariables = {
      Z_KEY: 'value',
      B_KEY: 'value',
      A_KEY: '',
    };

    const example: EnvVariables = {
      Z_KEY: 'example',
      B_KEY: 'example',
      A_KEY: 'example',
      Y_KEY: 'example',
      C_KEY: 'example',
    };

    const result = compareEnv(actual, example);

    expect(result.valid).toEqual(['B_KEY', 'Z_KEY']);
    expect(result.empty).toEqual(['A_KEY']);
    expect(result.missing).toEqual(['C_KEY', 'Y_KEY']);
  });

  it('should handle an empty example file', () => {
    const actual: EnvVariables = {
      APP_NAME: 'EnvMender',
    };

    const result = compareEnv(actual, {});

    expect(result.undocumented).toEqual(['APP_NAME']);
    expect(result.valid).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it('should handle two empty files', () => {
    const result = compareEnv({}, {});

    expect(result).toEqual({
      missing: [],
      empty: [],
      undocumented: [],
      valid: [],
    });
  });
});
