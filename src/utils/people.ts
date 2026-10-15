/** Builds a deduplicated, newest-first filmography without incomplete poster entries. */
import type { MovieCardData, PersonMovieCreditsResponse } from '../api/types';
import { isValidIsoDate } from './formatters';

export function getPersonFilmography(
  credits: PersonMovieCreditsResponse,
): MovieCardData[] {
  const filmography = new Map<number, MovieCardData>();

  for (const credit of credits.cast) {
    if (!credit.poster_path || !isValidIsoDate(credit.release_date)) {
      continue;
    }
    filmography.set(credit.id, {
      id: credit.id,
      title: credit.title,
      poster_path: credit.poster_path,
      release_date: credit.release_date,
      vote_average: credit.vote_average,
    });
  }

  for (const credit of credits.crew) {
    if (
      !credit.poster_path ||
      !isValidIsoDate(credit.release_date) ||
      filmography.has(credit.id)
    ) {
      continue;
    }
    filmography.set(credit.id, {
      id: credit.id,
      title: credit.title,
      poster_path: credit.poster_path,
      release_date: credit.release_date,
    });
  }

  return [...filmography.values()].sort((first, second) =>
    second.release_date.localeCompare(first.release_date),
  );
}
