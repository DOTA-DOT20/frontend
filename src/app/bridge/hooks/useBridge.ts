import { useContext } from "react";
import { BridgeContext, BridgePayload } from "./BridgeRoot";

function useBridge() {
  const accRoot = useContext(BridgeContext);

  function setValue(payload: BridgePayload) {
    accRoot?.dispatch({
      type: "set",
      payload,
    });
  }
  function clearValue(type: "dot20" | "token") {
    accRoot?.dispatch({
      type: "set",
      payload: { type },
    });
  }

  return {
    dot20: accRoot?.bridge.dot20,
    token: accRoot?.bridge.token,
    setValue,
    clearValue,
  };
}

export default useBridge;
