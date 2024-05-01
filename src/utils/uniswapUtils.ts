import { Token, CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import { Pair, Route, Trade } from "@uniswap/v2-sdk";
import { readContract } from "@wagmi/core";

import { croeConfig, dotaEvmChain } from "../app/swap/config";
import { DOTAContractConfig } from "../app/swap/config/DOTAContractConfig";
import { USDTContractConfig } from "../app/swap/config/USDTContractConfig";
import { PairContractConfig } from "../app/swap/config/PairContractConfig";

export async function getTrade({
  tick,
  act,
  amount,
}: {
  tick: "usdt/dota" | "dota/usdt";
  act: "usdt" | "dota";
  amount: BigInt;
}): Promise<Trade<Token, Token, TradeType>> {
  const DOTA = new Token(dotaEvmChain.id, DOTAContractConfig.address, 18);
  const USDT = new Token(dotaEvmChain.id, USDTContractConfig.address, 18);

  const reserves = await readContract(croeConfig, {
    ...PairContractConfig,
    functionName: "getReserves",
  });

  // 0:DOTA 1:USDT
  const [reserve0, reserve1] = reserves;

  const USDT_DOTA = new Pair(
    CurrencyAmount.fromRawAmount(DOTA, reserve0.toString()),
    CurrencyAmount.fromRawAmount(USDT, reserve1.toString())
  );

  const DOTA_USDT = new Pair(
    CurrencyAmount.fromRawAmount(USDT, reserve1.toString()),
    CurrencyAmount.fromRawAmount(DOTA, reserve0.toString())
  );

  const [tick0, tick1] = tick.split("/");
  const type = act === tick0 ? TradeType.EXACT_OUTPUT : TradeType.EXACT_INPUT;

  const route =
    tick === "usdt/dota"
      ? new Route([USDT_DOTA], USDT_DOTA.token1, USDT_DOTA.token0)
      : new Route([DOTA_USDT], DOTA_USDT.token1, DOTA_USDT.token0);

  const trade = new Trade(
    route,
    CurrencyAmount.fromRawAmount(
      type === TradeType.EXACT_INPUT ? route.input : route.output,
      amount.toString()
    ),
    type
  );
  return trade;
}
