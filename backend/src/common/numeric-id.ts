import { randomInt } from 'node:crypto';

export function numericId12(): string {
  let value = '';

  // First digit cannot be zero.
  value += String(randomInt(1, 10));

  for (let i = 1; i < 12; i++) {
    value += String(randomInt(0, 10));
  }

  return value;
}

export function temporaryPassword(): string {
  return `Gp@${numericId12().slice(0, 8)}`;
}