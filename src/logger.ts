import chalk from 'chalk';

export function error(...args: unknown[]) {
  console.log(chalk.red(...args));
}

export function warn(...args: unknown[]) {
  console.log(chalk.yellow(...args));
}

export function info(...args: unknown[]) {
  console.log(chalk.cyan(...args));
}

export function success(...args: unknown[]) {
  console.log(chalk.green(...args));
}

export function highlight(...args: unknown[]) {
  return chalk.cyan(...args);
}

export function log(...args: unknown[]) {
  console.log(...args);
}

export default {
  error,
  warn,
  info,
  success,
  highlight,
  log,
};
