import useSwap from "./useSwap";

function useSwapTicks() {
  const { data: payData } = useSwap("pay");
  const { data: receivedData } = useSwap("received");

  return {
    ticks: (receivedData?.token && payData?.token
      ? `${receivedData?.token}/${payData?.token}`
      : undefined) as "usdt/dota" | "dota/usdt" | undefined,
  };
}

export default useSwapTicks;
