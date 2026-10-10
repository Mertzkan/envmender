import { readFileSync } from 'node:fs';
import { parse } from 'dotenv';

import type { EnvVariables } from '../types.js';

export function readEnvFile(filePath: string): EnvVariables {
  const content = readFileSync(filePath, 'utf8');

  return parse(content);
}
