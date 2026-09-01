import { randomInt } from 'node:crypto';

export function numeric12(): string {
  let output = String(randomInt(1, 10));

  for (let i = 1; i < 12; i++) {
    output += String(randomInt(0, 10));
  }

  return output;
}

export function generatedPassword(): string {
  return `Gp@${numeric12().substring(0, 8)}`;
}