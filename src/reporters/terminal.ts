import pc from 'picocolors';
import type { ComparisonResult } from '../types.js';

function addSection(
  lines: string[],
  title: string,
  variables: string[],
  format: (text: string) => string,
): void {
  if (variables.length === 0) {
    return;
  }

  lines.push('');
  lines.push(format(`${title} (${variables.length})`));

  for (const variable of variables) {
    lines.push(`  ${variable}`);
  }
}

export function formatTerminalReport(
  result: ComparisonResult,
  useColors: boolean = process.stdout.isTTY === true &&
    process.env.CI === undefined &&
    process.env.NO_COLOR === undefined,
): string {
  const colors = pc.createColors(useColors);

  const errorCount = result.missing.length + result.empty.length;

  const warningCount = result.undocumented.length;

  const lines: string[] = [
    '',
    colors.bold(colors.cyan('🛠️ EnvMender')),
    colors.dim('=========================='),
    colors.dim('Checking environment configuration...'),
    '',
    colors.bold('Summary'),
    '',
    `  ${colors.green('✓')} Valid:        ${result.valid.length}`,
    `  ${colors.red('✗')} Missing:      ${result.missing.length}`,
    `  ${colors.red('✗')} Empty:        ${result.empty.length}`,
    `  ${colors.yellow('⚠')} Undocumented: ${result.undocumented.length}`,
  ];

  addSection(lines, '✗ Missing variables', result.missing, colors.red);

  addSection(lines, '✗ Empty variables', result.empty, colors.red);

  addSection(
    lines,
    '⚠ Undocumented variables',
    result.undocumented,
    colors.yellow,
  );

  lines.push('');
  lines.push(colors.dim('=========================='));

  if (errorCount > 0) {
    lines.push(colors.red(colors.bold('✗ Validation failed')));
  } else {
    lines.push(colors.green(colors.bold('✓ Validation passed')));
  }

  lines.push(`${errorCount} error(s), ${warningCount} warning(s)`);

  lines.push('');

  return lines.join('\n');
}
