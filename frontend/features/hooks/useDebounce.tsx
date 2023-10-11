import { DependencyList, useCallback, useEffect, useRef } from "react";

export type TuseDebounceFnReturn = [() => boolean | null, () => void];

/**
 * useDebounce - React hook that delays invoking a function (fn) until after wait milliseconds (ms) have elapsed since the last time the debounced function was invoked.
 * The third argument (deps) is the array of values that the debounce depends on, in the same manner as useEffect. The debounce timeout will start when one of the values changes.
 * @param fn
 * @param ms
 * @param deps
 * @returns [isReady, cancel]
 */
const useDebounce = (
  fn: Function,
  ms: number = 0,
  deps: DependencyList = []
): TuseDebounceFnReturn => {
  const readyRef = useRef<boolean | null>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(fn);

  const isReadyFn = useCallback(() => readyRef.current, []);

  const set = useCallback(() => {
    readyRef.current = false;
    timeoutRef.current && clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      readyRef.current = true;
      callbackRef.current();
    }, ms);
    // Disable hint since we want to reset on any dependency change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, deps]);

  const cancelFn = useCallback(() => {
    readyRef.current = null;
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    callbackRef.current = fn;
  }, [fn]);

  useEffect(() => {
    set();

    return cancelFn;
  }, [cancelFn, ms, set]);

  return [isReadyFn, cancelFn];
};

export default useDebounce;
