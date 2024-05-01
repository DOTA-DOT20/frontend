import { getTrade } from "@/utils/uniswapUtils";
import { TradeType } from "@uniswap/sdk-core";
import useSwap from "./useSwap";
import useSwapTicks from "./useSwapTicks";

function useCalcSwap(type: "pay" | "received") {
  const { data, setValue } = useSwap(type);
  const { data: otherData } = useSwap(type === "pay" ? "received" : "pay");
  const { ticks } = useSwapTicks();

  async function setOtherTokenInput(val?: string) {
    const v = val && val !== "" ? val : "0";

    if (parseFloat(v) <= 0) {
      setValue({
        type: type === "pay" ? "received" : "pay",
        data: { inputValue: "" },
      });
      return;
    }

    if (data?.token && otherData?.token && ticks) {
      const { inputAmount, outputAmount } = await getTrade({
        tick: ticks,
        act: data?.token,
        amount: BigInt(Number(val) * Math.pow(10, 18)),
      });

      setValue({
        type: type === "pay" ? "received" : "pay",
        data: {
          inputValue:
            type === "pay"
              ? outputAmount.toSignificant(6)
              : inputAmount.toSignificant(6),
        },
      });
    }
  }

  return { setOtherTokenInput };
}

export default useCalcSwap;
