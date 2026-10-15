/** Persists a small movie-only watchlist locally and exposes it to cards and details. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { MovieCardData } from '../api/types';

const STORAGE_KEY = '@movie-discovery/watchlist';

interface WatchlistContextValue {
  movies: MovieCardData[];
  isLoading: boolean;
  storageError: string | null;
  add: (movie: MovieCardData) => Promise<void>;
  remove: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  clear: () => Promise<void>;
  retryStorage: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

function isMovieCardData(value: unknown): value is MovieCardData {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const movie = value as Record<string, unknown>;
  return (
    typeof movie.id === 'number' &&
    typeof movie.title === 'string' &&
    (typeof movie.poster_path === 'string' || movie.poster_path === null) &&
    typeof movie.release_date === 'string' &&
    (movie.vote_average === undefined || typeof movie.vote_average === 'number')
  );
}

function isMovieList(value: unknown): value is MovieCardData[] {
  return Array.isArray(value) && value.every(isMovieCardData);
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<MovieCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const storageFailureRef = useRef<'load' | 'save' | null>(null);
  const moviesRef = useRef<MovieCardData[]>([]);
  // Wait for the first disk read before allowing writes to avoid replacing saved data.
  const readyRef = useRef<Promise<void> | null>(null);
  const finishLoadingRef = useRef<() => void>(() => undefined);
  const writeQueueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let isMounted = true;
    readyRef.current = new Promise<void>((resolve) => {
      finishLoadingRef.current = resolve;
    });

    const load = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (!storedValue) {
          return;
        }

        const parsed: unknown = JSON.parse(storedValue);
        if (!isMovieList(parsed)) {
          throw new Error('Saved watchlist has an invalid format.');
        }
        moviesRef.current = parsed;
        if (isMounted) {
          setMovies(parsed);
        }
      } catch {
        if (isMounted) {
          storageFailureRef.current = 'load';
          setStorageError('Your watchlist could not be loaded from this device.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
        finishLoadingRef.current();
      }
    };
    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  // Serialize writes so rapid heart taps cannot finish out of order on disk.
  const persist = useCallback((nextMovies: MovieCardData[]) => {
    moviesRef.current = nextMovies;
    setMovies(nextMovies);
    writeQueueRef.current = writeQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextMovies));
          storageFailureRef.current = null;
          setStorageError(null);
        } catch {
          storageFailureRef.current = 'save';
          setStorageError('Your watchlist could not be saved on this device.');
        }
      });
    return writeQueueRef.current;
  }, []);

  const add = useCallback(
    async (movie: MovieCardData) => {
      await readyRef.current;
      if (moviesRef.current.some((savedMovie) => savedMovie.id === movie.id)) {
        return;
      }
      await persist([movie, ...moviesRef.current]);
    },
    [persist],
  );

  const remove = useCallback(
    async (movieId: number) => {
      await readyRef.current;
      await persist(moviesRef.current.filter((movie) => movie.id !== movieId));
    },
    [persist],
  );

  const clear = useCallback(async () => {
    await readyRef.current;
    await persist([]);
  }, [persist]);

  const retryStorage = useCallback(async () => {
    await readyRef.current;
    if (storageFailureRef.current === 'save') {
      await persist(moviesRef.current);
      return;
    }

    try {
      const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedValue) {
        moviesRef.current = [];
        setMovies([]);
      } else {
        const parsed: unknown = JSON.parse(storedValue);
        if (!isMovieList(parsed)) {
          throw new Error('Saved watchlist has an invalid format.');
        }
        moviesRef.current = parsed;
        setMovies(parsed);
      }
      storageFailureRef.current = null;
      setStorageError(null);
    } catch {
      storageFailureRef.current = 'load';
      setStorageError('Your watchlist could not be loaded from this device.');
    }
  }, [persist]);

  const isInWatchlist = useCallback(
    (movieId: number) => movies.some((movie) => movie.id === movieId),
    [movies],
  );

  const value = useMemo(
    () => ({
      movies,
      isLoading,
      storageError,
      add,
      remove,
      isInWatchlist,
      clear,
      retryStorage,
    }),
    [add, clear, isInWatchlist, isLoading, movies, remove, retryStorage, storageError],
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistContextValue {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used inside WatchlistProvider.');
  }
  return context;
}
