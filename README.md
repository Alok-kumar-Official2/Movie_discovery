# Movie Discovery

## Project overview

Movie Discovery is an Expo app for finding movies, TV shows, and people using TMDB
(The Movie Database). It is written in TypeScript and uses a dark, cinematic interface.
The app has separate screens for browsing lists, searching, filtering, viewing details,
and keeping a personal movie watchlist.

## Screenshots

Screenshots can be added here after running the app on a device:

| Home                    | Movie details                    | Search                    |
| ----------------------- | -------------------------------- | ------------------------- |
| _Add a Home screenshot_ | _Add a Movie Details screenshot_ | _Add a Search screenshot_ |

## Features

- Home shows trending movies and Now Playing, Popular, Top Rated, and Upcoming carousels.
- Movie details include credits, videos, reviews, providers, recommendations, similar
  movies, and a backdrop gallery.
- Search supports movies, TV shows, and people, or movies only. Search waits until typing
  settles and remembers up to eight recent searches on the device.
- Explore filters movies by genre, sort order, year, and minimum rating.
- TV browsing supports Popular and Top Rated lists, and includes TV details and seasons.
- Person pages show a profile, biography, and newest-first filmography.
- A watchlist can be saved locally, even between app launches.
- Long lists use pagination. List and detail screens show loading, error, empty, and
  success states where they apply.
- Offline status is shown in data screens. A missing API token has a setup screen.
- The About screen shows the TMDB attribution.

## Tech stack

| Library                     | Why it is used                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| Expo (managed workflow)     | Runs the app on Android and iOS without maintaining native project files for routine development. |
| React Native                | Builds the app's native user interface from React components.                                     |
| TypeScript                  | Checks API data, component props, and navigation routes before runtime.                           |
| Axios                       | Sends HTTP requests through one configured TMDB client.                                           |
| TanStack React Query        | Caches remote data and manages loading, retries, pagination, and refetching.                      |
| React Navigation            | Provides the bottom tabs and the stack of detail screens.                                         |
| AsyncStorage                | Saves watchlist movies and recent searches on the device.                                         |
| Expo Image                  | Displays TMDB artwork with memory-and-disk image caching.                                         |
| Safe Area Context           | Keeps screen content clear of notches and system bars.                                            |
| React Native Screens        | Uses native screen containers for navigation.                                                     |
| Gesture Handler             | Supplies gesture support required by navigation and interactive screens.                          |
| Expo Vector Icons           | Supplies tab, rating, and action icons.                                                           |
| react-native-youtube-iframe | Plays selected YouTube trailers inside the app.                                                   |
| react-native-webview        | Provides the WebView used by the YouTube player.                                                  |
| NetInfo                     | Detects connectivity and tells React Query when the device reconnects.                            |
| ESLint                      | Finds common code-quality and correctness issues.                                                 |
| Prettier                    | Keeps source and documentation formatting consistent.                                             |

## Prerequisites

- Node.js LTS and npm.
- A TMDB API Read Access Token.
- Expo Go for a physical device, or Android Studio / Xcode for an emulator or simulator.
- A network connection for TMDB data and artwork.

## Setup

1. Clone the project and enter its folder:

   ```powershell
   git clone <repository-url>
   cd Movie_discovery_app
   ```

2. Install the dependencies:

   ```powershell
   npm install
   ```

3. Copy the example environment file and open the local copy:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Replace the placeholder value in `.env`:

   ```text
   EXPO_PUBLIC_TMDB_TOKEN=your_tmdb_read_access_token
   ```

   `.env` is ignored by Git. The `EXPO_PUBLIC_` prefix means Expo places this value in
   the client application. It is not a server-side secret; do not commit the token or
   share production credentials in screenshots or logs. Restart Expo after changing it.

5. Start the development server:

   ```powershell
   npx expo start
   ```

6. Run the app:
   - **Expo Go:** scan the QR code shown by Expo.
   - **Android:** press `a` in the Expo terminal, or run `npx expo start --android`.
   - **iOS:** press `i` in the Expo terminal, or run `npx expo start --ios` on macOS with
     Xcode installed.

If the token is missing, the app displays a setup message instead of making API requests.

## Project structure

```text
App.tsx                         App providers, connectivity, and startup configuration
src/
  api/                          Axios client, endpoint functions, and API types
  components/
    common/                     Shared loading, error, image, and layout components
    movie/                      Movie cards, grids, search, and movie-detail sections
    person/                     Person and cast components
    tv/                         TV cards, credits, overview, and seasons
  context/                      Local watchlist state and persistence
  hooks/                        React Query hooks, debounce, network, and local storage
  navigation/                   Typed root stack and bottom-tab navigators
  screens/                      Home, Search, Explore, TV, Watchlist, and detail screens
  theme/                        Shared colors, spacing, and typography
  utils/                        Formatting, constants, errors, and media helpers
docs/
  API_REFERENCE.md              Endpoint paths and response notes
  ARCHITECTURE.md                Application design and data flow
  INTERVIEW_NOTES.md             Project pitch, walkthrough, and interview practice
```

## Implemented TMDB endpoints

Each API operation is defined in `src/api/endpoints.ts`. Screens call the endpoint
functions through the React Query hooks listed below.

| Method | Path                                | Screen where used         | Hook / file that calls endpoint                                     |
| ------ | ----------------------------------- | ------------------------- | ------------------------------------------------------------------- |
| GET    | `/configuration`                    | App root startup          | `useConfiguration` — `src/hooks/useMovieLists.ts`                   |
| GET    | `/genre/movie/list`                 | Explore                   | `useMovieGenres` — `src/hooks/useDiscoveryQueries.ts`               |
| GET    | `/trending/movie/{time_window}`     | Home                      | `useTrendingMovies` — `src/hooks/useMovieLists.ts`                  |
| GET    | `/movie/now_playing`                | Home and See All          | `useMovieList` / `useInfiniteMovies` — `src/hooks/useMovieLists.ts` |
| GET    | `/movie/popular`                    | Home and See All          | `useMovieList` / `useInfiniteMovies` — `src/hooks/useMovieLists.ts` |
| GET    | `/movie/top_rated`                  | Home and See All          | `useMovieList` / `useInfiniteMovies` — `src/hooks/useMovieLists.ts` |
| GET    | `/movie/upcoming`                   | Home and See All          | `useMovieList` / `useInfiniteMovies` — `src/hooks/useMovieLists.ts` |
| GET    | `/movie/{movie_id}`                 | Movie Details             | `useMovieDetails` — `src/hooks/useMovieDetails.ts`                  |
| GET    | `/movie/{movie_id}/credits`         | Movie Details             | `useMovieCredits` — `src/hooks/useMovieDetails.ts`                  |
| GET    | `/movie/{movie_id}/videos`          | Movie Details             | `useMovieVideos` — `src/hooks/useMovieDetails.ts`                   |
| GET    | `/movie/{movie_id}/reviews`         | Movie Details             | `useMovieReviews` — `src/hooks/useMovieDetails.ts`                  |
| GET    | `/movie/{movie_id}/similar`         | Movie Details             | `useSimilarMovies` — `src/hooks/useMovieDetails.ts`                 |
| GET    | `/movie/{movie_id}/recommendations` | Movie Details             | `useMovieRecommendations` — `src/hooks/useMovieDetails.ts`          |
| GET    | `/movie/{movie_id}/watch/providers` | Movie Details             | `useMovieWatchProviders` — `src/hooks/useMovieDetails.ts`           |
| GET    | `/movie/{movie_id}/images`          | Movie Details and Gallery | `useMovieImages` — `src/hooks/useMovieDetails.ts`                   |
| GET    | `/search/movie`                     | Search, Movies only       | `useSearchMovies` — `src/hooks/useDiscoveryQueries.ts`              |
| GET    | `/search/multi`                     | Search, All media         | `useSearchMulti` — `src/hooks/useDiscoveryQueries.ts`               |
| GET    | `/discover/movie`                   | Explore                   | `useDiscoverMovies` — `src/hooks/useDiscoveryQueries.ts`            |
| GET    | `/person/popular`                   | Explore                   | `usePopularPeople` — `src/hooks/useDiscoveryQueries.ts`             |
| GET    | `/person/{person_id}`               | Person Details            | `usePersonDetails` — `src/hooks/usePersonAndTv.ts`                  |
| GET    | `/person/{person_id}/movie_credits` | Person Details            | `usePersonMovieCredits` — `src/hooks/usePersonAndTv.ts`             |
| GET    | `/tv/popular`                       | TV tab, Popular           | `useInfiniteTvList` — `src/hooks/usePersonAndTv.ts`                 |
| GET    | `/tv/top_rated`                     | TV tab, Top Rated         | `useInfiniteTvList` — `src/hooks/usePersonAndTv.ts`                 |
| GET    | `/tv/{series_id}`                   | TV Details                | `useTvDetails` — `src/hooks/usePersonAndTv.ts`                      |

## Error handling approach

1. The Axios client uses a 15-second timeout and adds the bearer token in its request
   interceptor.
2. Its response interceptor converts network failures, timeouts, and HTTP status codes
   into a typed `AppError` with user-friendly text.
3. React Query retries network, timeout, and server failures up to two times. It does not
   retry authorization, not-found, rate-limit, or unknown failures automatically.
4. Screens display a retry action for recoverable API failures. Independent movie-detail
   sections can fail without hiding the rest of the page.
5. Local storage operations have their own errors and retry actions. The root error
   boundary is a final fallback for unexpected render errors, not a replacement for
   normal API error handling.

## Known limitations

- A TMDB read token is required. Since this is a client application, an Expo public
  environment variable is visible in the built app and cannot be treated as a secret.
- The live API key table is the 24 documented request templates. `/configuration` is
  requested by the app root at startup; all other operations are reached from their
  listed screens through the corresponding query hooks.
- The app has been checked with TypeScript, ESLint, Prettier, and an Android Expo export;
  this does not replace testing on physical Android and iOS devices.
- Search history and watchlist data are local to one device and are not synced to a TMDB
  account or cloud service.
- Provider availability is shown for region `IN`; availability depends on TMDB's data.
- YouTube playback depends on network access and the availability of an embeddable video.
- The screenshots section is a placeholder until device captures are added.

## Future improvements

- Add unit tests for formatters, endpoint parameter construction, and trailer selection.
- Add component and navigation tests for the main loading, error, empty, and success
  states.
- Capture Android and iOS screenshots and test on physical devices and smaller screens.
- Add a server-side proxy if the API credential must be kept out of client bundles.
- Add optional account-based watchlist synchronization and configurable provider region.
- Add accessibility checks and automated CI for lint, type checking, tests, and export.

## TMDB attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
