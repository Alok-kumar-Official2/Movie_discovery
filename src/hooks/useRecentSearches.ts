/** Persists a small, deduplicated history so search is useful before typing. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = '@movie-discovery/recent-searches';
const MAX_RECENT_SEARCHES = 8;

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const storageFailureRef = useRef<'load' | 'save' | 'clear' | null>(null);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((storedValue) => {
        if (!storedValue) {
          return;
        }

        const parsed: unknown = JSON.parse(storedValue);
        if (!isStringList(parsed)) {
          throw new Error('Saved searches are not in the expected format.');
        }

        if (isMounted) {
          setSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      })
      .catch(() => {
        if (isMounted) {
          storageFailureRef.current = 'load';
          setStorageError('Recent searches could not be loaded from this device.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const addSearch = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query) {
        return;
      }

      const nextSearches = [
        query,
        ...searches.filter(
          (existing) => existing.toLocaleLowerCase() !== query.toLocaleLowerCase(),
        ),
      ].slice(0, MAX_RECENT_SEARCHES);

      setSearches(nextSearches);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSearches));
        storageFailureRef.current = null;
        setStorageError(null);
      } catch {
        storageFailureRef.current = 'save';
        setStorageError('Recent searches could not be saved on this device.');
      }
    },
    [searches],
  );

  const clearSearches = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSearches([]);
      storageFailureRef.current = null;
      setStorageError(null);
    } catch {
      storageFailureRef.current = 'clear';
      setStorageError('Recent searches could not be cleared from this device.');
    }
  }, []);

  const retryStorage = useCallback(async () => {
    try {
      if (storageFailureRef.current === 'save') {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
      } else if (storageFailureRef.current === 'clear') {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setSearches([]);
      } else {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (!storedValue) {
          setSearches([]);
        } else {
          const parsed: unknown = JSON.parse(storedValue);
          if (!isStringList(parsed)) {
            throw new Error('Saved searches are not in the expected format.');
          }
          setSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      }
      storageFailureRef.current = null;
      setStorageError(null);
    } catch {
      storageFailureRef.current = 'load';
      setStorageError('Recent searches could not be loaded from this device.');
    }
  }, [searches]);

  return { searches, isLoading, storageError, addSearch, clearSearches, retryStorage };
}
