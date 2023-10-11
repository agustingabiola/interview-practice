import { useEffect, useRef } from "react";

/**
 * A declarative interval hook based on [Dan Abramov's article on overreacted.io](https://overreacted.io/making-setinterval-declarative-with-react-hooks). The interval can be paused by setting the delay to `null`.
 * @param callback
 * @param delay
 */
const useInterval = (callback: Function, delay?: number | null) => {
  const savedCallbackRef = useRef<Function>(() => {});

  // If the callback didn't have other dependencies we wouldn't need this re-definition on each render and we could just set this on init. For example
  // the callback could have been () => setCount((cur) => cur + 1)
  useEffect(() => {
    savedCallbackRef.current = callback;
  });

  useEffect(() => {
    if (delay !== null) {
      const intervalId = setInterval(
        () => savedCallbackRef.current(),
        delay || 0
      );
      return () => clearInterval(intervalId);
    }

    return undefined;
  }, [delay]);
};

export default useInterval;
