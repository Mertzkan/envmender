#!/usr/bin/env node

import { Command, Option } from 'commander';
import { resolve } from 'node:path';

import { readEnvFile } from './core/parser.js';
import { compareEnv } from './core/compare.js';

import { formatTerminalReport } from './reporters/terminal.js';
import { formatJsonReport, formatJsonError } from './reporters/json.js';

interface CheckOptions {
  env: string;
  example: string;
  format: 'terminal' | 'json';
}

const program = new Command();

program
  .name('envmender')
  .description('A lightweight CLI for validating environment files.')
  .version('0.1.0');

program
  .command('check')
  .description('Check environment variables against an example file.')
  .option('--env <path>', 'Path to the environment file', '.env')
  .option(
    '--example <path>',
    'Path to the example environment file',
    '.env.example',
  )
  .addOption(
    new Option('--format <type>', 'Output format')
      .choices(['terminal', 'json'])
      .default('terminal'),
  )
  .action((options: CheckOptions) => {
    try {
      const envPath = resolve(options.env);
      const examplePath = resolve(options.example);

      const actual = readEnvFile(envPath);
      const example = readEnvFile(examplePath);

      const result = compareEnv(actual, example);

      if (options.format === 'json') {
        console.log(formatJsonReport(result));
      } else {
        console.log(formatTerminalReport(result));
      }

      const hasErrors = result.missing.length > 0 || result.empty.length > 0;

      if (hasErrors) {
        process.exitCode = 1;
      }
    } catch {
      if (options.format === 'json') {
        console.log(formatJsonError());
      } else {
        console.error('\n❌ EnvMender could not complete validation.');

        console.error('Check environment file paths and permissions.');
      }

      process.exitCode = 2;
    }
  });

program.parse(process.argv);
