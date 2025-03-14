import { Request } from 'express';

export function isNumber(value: string) {
  return !isNaN(Number(value));
}

export function log(endpoint: string, req: Request) {
  let now = new Date();
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  let seconds = now.getSeconds().toString().padStart(2, '0');
  console.log(`[${hours}:${minutes}:${seconds}] [${endpoint}]`);
}