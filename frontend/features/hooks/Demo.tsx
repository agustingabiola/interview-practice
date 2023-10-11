/**
 * Examples and documentation from:
 *
 *  https://github.com/streamich/react-use/blob/master/docs/useInterval.md
 *  https://github.com/streamich/react-use/blob/master/docs/useDebounce.md
 *
 */
import React, { useCallback, useState } from "react";
import useDebounce from "./useDebounce";
import useInterval from "./useInterval";

const DemoUseDebounce = () => {
  const [state, setState] = React.useState("Typing init");
  const [val, setVal] = React.useState("");
  const [debouncedValue, setDebouncedValue] = React.useState("");

  const [isReady, cancel] = useDebounce(
    () => {
      setState("Typing stopped");
      setDebouncedValue(val);
    },
    2000,
    [val]
  );

  return (
    <div>
      <input
        type="text"
        value={val}
        placeholder="Debounced input"
        onChange={({ currentTarget }) => {
          setState("Waiting for typing to stop...");
          setVal(currentTarget.value);
        }}
      />
      <div>{state}</div>
      <div>
        Debounced value:{" "}
        {debouncedValue ? (
          <span style={{ color: isReady() ? "green" : "red" }}>
            {debouncedValue}
          </span>
        ) : null}
      </div>
      <div>
        <button onClick={cancel}>Cancel debounce</button>
      </div>
    </div>
  );
};

const DemoUseInterval = () => {
  const [count, setCount] = React.useState(0);
  const [delay, setDelay] = React.useState(1000);
  const [isRunning, setIsRunning] = useState(true);

  const toggleIsRunning = useCallback(() => setIsRunning((cur) => !cur), []);

  useInterval(
    () => {
      setCount(count + 1);
    },
    isRunning ? delay : null
  );

  return (
    <div>
      <div>
        delay:{" "}
        <input
          value={delay}
          onChange={(event) => setDelay(Number(event.target.value))}
        />
      </div>
      <h1>count: {count}</h1>
      <div>
        <button onClick={toggleIsRunning}>
          {isRunning ? "stop" : "start"}
        </button>
      </div>
    </div>
  );
};

export default function DemoHooks() {
  return (
    <>
      <DemoUseDebounce />
      <DemoUseInterval />
    </>
  );
}
