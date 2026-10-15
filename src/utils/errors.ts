/** Keeps React Query failures presentable without leaking Axios internals. */
import { AppError } from '../api/client';

export function getUserErrorMessage(error: unknown, fallback: string): string {
  return error instanceof AppError ? error.message : fallback;
}
