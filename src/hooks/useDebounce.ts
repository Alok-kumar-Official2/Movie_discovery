/** Delays rapidly changing user input so search requests begin after typing settles. */
import { useEffect, useState } from 'react';

export function useDebounce<TValue>(value: TValue, delayMs: number): TValue {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Cancel the previous timer so a request starts only after input has stayed unchanged.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs, value]);

  return debouncedValue;
}
