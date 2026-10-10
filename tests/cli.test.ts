import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

const cliPath = fileURLToPath(new URL('../src/cli.ts', import.meta.url));

describe('EnvMender CLI', () => {
  let testDirectory: string;
  let envPath: string;
  let examplePath: string;

  beforeEach(() => {
    testDirectory = mkdtempSync(join(tmpdir(), 'envmender-cli-'));

    envPath = join(testDirectory, '.env');
    examplePath = join(testDirectory, '.env.example');
  });

  afterEach(() => {
    rmSync(testDirectory, {
      recursive: true,
      force: true,
    });
  });

  function runCheck(extraArgs: string[] = []) {
    return spawnSync(
      process.execPath,
      [
        '--import',
        'tsx',
        cliPath,
        'check',
        '--env',
        envPath,
        '--example',
        examplePath,
        ...extraArgs,
      ],
      {
        cwd: projectRoot,
        encoding: 'utf8',
        env: {
          ...process.env,
          NO_COLOR: '1',
        },
      },
    );
  }

  it('should return JSON and exit code 0', () => {
    writeFileSync(envPath, 'API_KEY=secret-test-value');

    writeFileSync(examplePath, 'API_KEY=placeholder');

    const result = runCheck(['--format', 'json']);
    const report = JSON.parse(result.stdout);

    expect(result.status).toBe(0);
    expect(report.status).toBe('passed');
    expect(report.summary.valid).toBe(1);
    expect(result.stderr).toBe('');
    expect(result.stdout).not.toContain('secret-test-value');
  });

  it('should return exit code 1 for validation errors', () => {
    writeFileSync(envPath, 'APP_NAME=EnvMender\nAPI_KEY=\nDEBUG_MODE=true');

    writeFileSync(
      examplePath,
      'APP_NAME=Example\nAPI_KEY=placeholder\nDATABASE_URL=example',
    );

    const result = runCheck(['--format', 'json']);
    const report = JSON.parse(result.stdout);

    expect(result.status).toBe(1);
    expect(report.status).toBe('failed');
    expect(report.variables.missing).toEqual(['DATABASE_URL']);
    expect(report.variables.empty).toEqual(['API_KEY']);
    expect(report.variables.undocumented).toEqual(['DEBUG_MODE']);
  });

  it('should return JSON and exit code 2 for missing files', () => {
    writeFileSync(examplePath, 'APP_NAME=Example');

    const result = runCheck(['--format', 'json']);
    const report = JSON.parse(result.stdout);

    expect(result.status).toBe(2);
    expect(report.status).toBe('error');
    expect(report.error.code).toBe('FILE_READ_ERROR');
    expect(result.stderr).toBe('');
  });

  it('should keep terminal output as default', () => {
    writeFileSync(envPath, 'APP_NAME=EnvMender');

    writeFileSync(examplePath, 'APP_NAME=Example');

    const result = runCheck();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Validation passed');
    expect(result.stdout).toContain('EnvMender');
  });
});
