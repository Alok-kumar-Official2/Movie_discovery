/** Formats TMDB values before they are presented in cards and detail views. */
import { IMAGE_BASE_URL, IMAGE_FALLBACK_URL } from './constants';

export type ImageSize =
  | 'w45'
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w300'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'w1280'
  | 'h632'
  | 'original';

/** Keeps missing image paths renderable without requiring each caller to branch. */
export function imageUrl(path: string | null | undefined, size: ImageSize): string {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : IMAGE_FALLBACK_URL;
}

/** Avoids displaying invalid or empty dates returned for unreleased titles. */
export function formatDate(value: string | null | undefined): string {
  if (!isValidIsoDate(value)) {
    return 'Date unavailable';
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/** Rejects calendar rollovers because JavaScript otherwise normalizes invalid dates. */
export function isValidIsoDate(value: string | null | undefined): value is string {
  if (!value) {
    return false;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  );
}

/** Calculates completed years only when the supplied birthday is a valid past date. */
export function calculateAge(
  birthday: string | null | undefined,
  today = new Date(),
): number | null {
  if (!birthday) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthday);
  if (!match) {
    return null;
  }

  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]);
  const birthDay = Number(match[3]);
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  if (
    birthDate.getFullYear() !== birthYear ||
    birthDate.getMonth() !== birthMonth - 1 ||
    birthDate.getDate() !== birthDay ||
    birthDate > today
  ) {
    return null;
  }

  let age = today.getFullYear() - birthYear;
  const birthdayNotReached =
    today.getMonth() < birthMonth - 1 ||
    (today.getMonth() === birthMonth - 1 && today.getDate() < birthDay);
  if (birthdayNotReached) {
    age -= 1;
  }
  return age;
}

/** Converts a positive runtime into hours and minutes; zero means not supplied. */
export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) {
    return 'Runtime unavailable';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

/** Displays zero budgets and revenue as unavailable instead of misleading currency. */
export function formatCurrency(amount: number | null | undefined): string {
  if (!amount || amount <= 0) {
    return 'Unavailable';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Shows a one-decimal TMDB score, preserving legitimate zero ratings. */
export function formatRating(rating: number | null | undefined): string {
  if (rating === null || rating === undefined || Number.isNaN(rating)) {
    return 'NR';
  }

  return rating.toFixed(1);
}
