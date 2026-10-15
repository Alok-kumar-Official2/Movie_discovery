/** Configures TMDB authorization and converts transport failures to AppError. */
import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_LANGUAGE } from '../utils/constants';

export type AppErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'notFound'
  | 'rateLimited'
  | 'server'
  | 'unknown';

export class AppError extends Error {
  public readonly kind: AppErrorKind;
  public readonly statusCode?: number;

  public constructor(kind: AppErrorKind, message: string, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.kind = kind;
    this.statusCode = statusCode;
  }
}

const accessToken = process.env.EXPO_PUBLIC_TMDB_TOKEN?.trim();

export const hasTmdbToken = Boolean(accessToken);

/** The shared Axios client supplies a consistent timeout and JSON headers. */
export const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
  params: {
    language: API_LANGUAGE,
  },
});

// Add credentials here once so individual endpoint functions cannot forget authorization.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return config;
  },
  (error: unknown) => Promise.reject(normalizeAppError(error)),
);

// Normalize rejected responses before hooks see them, keeping UI error handling transport-agnostic.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeAppError(error)),
);

/** Translates Axios status and transport information into safe UI copy. */
function normalizeAppError(error: unknown): AppError {
  if (!isAxiosError<unknown>(error)) {
    return new AppError('unknown', 'Something went wrong. Please try again.');
  }

  const statusCode = error.response?.status;

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new AppError(
      'timeout',
      'The request took too long. Check your connection and try again.',
      statusCode,
    );
  }

  if (statusCode === 401) {
    return new AppError(
      'unauthorized',
      'TMDB could not authorize this request. Check your API token.',
      statusCode,
    );
  }

  if (statusCode === 404) {
    return new AppError(
      'notFound',
      'The requested title could not be found.',
      statusCode,
    );
  }

  if (statusCode === 429) {
    return new AppError(
      'rateLimited',
      'Too many requests. Please wait a moment and try again.',
      statusCode,
    );
  }

  if (statusCode !== undefined && statusCode >= 500) {
    return new AppError(
      'server',
      'TMDB is temporarily unavailable. Please try again.',
      statusCode,
    );
  }

  if (!error.response) {
    return new AppError(
      'network',
      'Unable to connect. Check your internet connection and try again.',
    );
  }

  return new AppError(
    'unknown',
    'The request could not be completed. Please try again.',
    statusCode,
  );
}
