import { useEffect, useCallback, useRef } from 'react';

export function usePolling(fetcher, onData, interval = 5000) {
  const mountedRef = useRef(true);
  const timerRef   = useRef(null);

  const run = useCallback(async () => {
    try {
      const data = await fetcher();
      if (mountedRef.current) onData(data);
    } catch (err) {
      if (mountedRef.current) onData(null, err);
    }
  }, [fetcher, onData]);

  useEffect(() => {
    mountedRef.current = true;
    run();
    timerRef.current = setInterval(run, interval);
    return () => {
      mountedRef.current = false;
      clearInterval(timerRef.current);
    };
  }, [run, interval]);
}
