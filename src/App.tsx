// @ts-expect-error - no types for react canary
import { use, useRef } from "react";
import { Reflect } from "@rocicorp/reflect/client";
import { mutators } from "./lib/mutators";
import { useSubscribe } from "@rocicorp/reflect/react";

const r = new Reflect({
  roomID: "myRoom",
  userID: "myUser",
  mutators,
  server: "http://localhost:8080",
  kvStore: "idb",
});

const getCount = new Promise((resolve) => {
  r.query((tx) => {
    resolve(tx.get<number>("count"));
  });
});

export default function App() {
  /**
   * Using the `use` hook to suspend until the
   * initial count value is available. This could
   * also be done via react-query or SWR.
   */
  const initial = use(getCount);
  const onClick = () => {
    void r.mutate.increment(1);
  };

  const count = useSubscribe(r, (tx) => tx.get<number>("count"), initial);
  const countOnFirstRender = useRef(count);

  return (
    <div>
      Count Value on First Render: {countOnFirstRender.current}
      <br />
      Sync'd Count Value: {count}
      <br />
      <button onClick={onClick}>increment</button>
    </div>
  );
}
