/** TMDB response types shaped only around fields documented in API_REFERENCE.md. */
export interface ApiListResponse<TItem> {
  page: number;
  results: TItem[];
  total_pages: number;
  total_results: number;
}

export interface ImageConfiguration {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}

export interface ConfigurationResponse {
  images: ImageConfiguration;
  change_keys: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreListResponse {
  genres: Genre[];
}

export interface MovieListItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type MovieListResponse = ApiListResponse<MovieListItem>;

export type MovieCardData = Omit<
  Pick<MovieListItem, 'id' | 'title' | 'poster_path' | 'release_date' | 'vote_average'>,
  'vote_average'
> & { vote_average?: number };

export interface MovieDateRange {
  maximum: string;
  minimum: string;
}

export interface DatedMovieListResponse extends MovieListResponse {
  dates: MovieDateRange;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieDetailsResponse {
  id: number;
  title: string;
  original_title: string;
  tagline: string | null;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  status: string;
  budget: number;
  revenue: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  homepage: string | null;
  imdb_id: string | null;
  original_language: string;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  belongs_to_collection: Record<string, unknown> | null;
}

export interface CastMember {
  id: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string | null;
  known_for_department: string;
  gender: number;
  order: number;
  cast_id: number;
  credit_id: string;
  popularity: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
}

export interface MovieCreditsResponse {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  name: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
  size: number;
  iso_639_1: string;
  iso_3166_1: string;
  published_at: string;
}

export interface MovieVideosResponse {
  id: number;
  results: Video[];
}

export interface ReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface MovieReview {
  id: string;
  author: string;
  author_details: ReviewAuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface MovieReviewsResponse {
  id: number;
  page: number;
  results: MovieReview[];
  total_pages: number;
  total_results: number;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface RegionalWatchProviders {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface MovieWatchProvidersResponse {
  id: number;
  results: Record<string, RegionalWatchProviders>;
}

export interface MovieBackdrop {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  vote_average: number;
  vote_count: number;
  iso_639_1: string | null;
}

export interface MovieImagesResponse {
  id: number;
  backdrops: MovieBackdrop[];
  posters: unknown[];
  logos: unknown[];
}

export interface TvListItem {
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

export type TvListResponse = ApiListResponse<TvListItem>;

export interface SearchMovieItem {
  media_type: 'movie';
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export interface SearchTvItem {
  media_type: 'tv';
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
}

export interface SearchPersonItem {
  media_type: 'person';
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

export type MultiSearchItem = SearchMovieItem | SearchTvItem | SearchPersonItem;
export type MultiSearchResponse = ApiListResponse<MultiSearchItem>;

export interface KnownForTitle {
  media_type: 'movie';
  id: number;
  title: string;
}

export interface PopularPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for: KnownForTitle[];
}

export type PopularPeopleResponse = ApiListResponse<PopularPerson>;

export interface PersonDetailsResponse {
  id: number;
  name: string;
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  gender: number;
  profile_path: string | null;
  homepage: string | null;
  imdb_id: string | null;
  popularity: number;
  adult: boolean;
}

export interface PersonMovieCastCredit {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  credit_id: string;
  order: number;
}

export interface PersonMovieCrewCredit {
  id: number;
  title: string;
  job: string;
  department: string;
  poster_path: string | null;
  release_date: string;
  credit_id: string;
}

export interface PersonMovieCreditsResponse {
  id: number;
  cast: PersonMovieCastCredit[];
  crew: PersonMovieCrewCredit[];
}

export interface TvCreator {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface TvNetwork {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TvSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
  overview: string;
  vote_average: number;
}

export interface TvDetailsResponse {
  id: number;
  name: string;
  original_name: string;
  tagline: string | null;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string | null;
  status: string;
  type: string;
  in_production: boolean;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  created_by: TvCreator[];
  networks: TvNetwork[];
  seasons: TvSeason[];
}

export interface LanguageParams {
  language?: string;
}

export interface PageParams extends LanguageParams {
  page?: number;
}

export interface RegionPageParams extends PageParams {
  region?: string;
}

export interface SearchMovieParams extends PageParams {
  query: string;
  include_adult?: boolean;
  year?: number;
}

export interface SearchMultiParams extends PageParams {
  query: string;
  include_adult?: boolean;
}

export interface DiscoverMovieParams extends PageParams {
  with_genres?: string;
  sort_by?: string;
  primary_release_year?: number;
  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
  with_original_language?: string;
  include_adult?: boolean;
}

export type TrendingTimeWindow = 'day' | 'week';
