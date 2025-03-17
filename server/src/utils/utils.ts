import { Request } from 'express';

export function isNumber(value: string) {
  return !isNaN(Number(value));
}

export function log(endpoint: string, req: Request) {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ip = req.ip == '::1' ? 'localhost' : req.ip;
  console.log(`[${hours}:${minutes}:${seconds}] [${ip}] [${endpoint}]`);
}