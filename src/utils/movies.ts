/** Shared movie helpers for selecting a useful trailer from TMDB videos. */
import type { Video } from '../api/types';

/** Restricts playback to YouTube trailers, then favors an official upload when available. */
export function selectMovieTrailer(videos: Video[]): Video | undefined {
  const trailers = videos.filter(
    (video) => video.site === 'YouTube' && video.type === 'Trailer',
  );
  return trailers.find((video) => video.official) ?? trailers[0];
}
