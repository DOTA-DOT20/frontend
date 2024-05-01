import { useContext } from "react";
import { SwapContext, SwapPayload } from "./SwapRoot";

function useSwap(type: "pay" | "received") {
  const swapRoot = useContext(SwapContext);

  function setValue(payload: SwapPayload) {
    swapRoot?.dispatch({
      type: "set",
      payload,
    });
  }

  function restInput() {
    swapRoot?.dispatch({
      type: "set",
      payload: { type, data: { inputValue: "" } },
    });
  }

  function clearValue() {
    swapRoot?.dispatch({
      type: "clear",
      payload: { type },
    });
  }

  function switchItem() {
    swapRoot?.dispatch({ type: "switch" });
  }

  return {
    data: swapRoot?.data[type],
    setValue,
    clearValue,
    restInput,
    switchItem,
  };
}

export default useSwap;
