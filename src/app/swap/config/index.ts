"use client";

import { createConfig } from "@wagmi/core";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { defineChain, http } from "viem";

// Get projectId at https://cloud.walletconnect.com
export const projectId = "d2823e59a9eb3ae9fe6a1ee333c58e1c";

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "DOTA-dot20",
  description: "DOTA-dot20",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://dota.fyi/favicon.svg"],
};

export const dotaEvmChain = defineChain({
  id: 1888,
  name: "DOTA-EVM",
  nativeCurrency: { name: "EVM-DOTA", symbol: "DOTA", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://fraa-flashbox-2879-rpc.a.stagenet.tanssi.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Tanssiscan",
      url: "https://evmexplorer.tanssi-chains.network/?rpcUrl=https://fraa-flashbox-2879-rpc.a.stagenet.tanssi.network",
      apiUrl:
        "https://evmexplorer.tanssi-chains.network/?rpcUrl=https://fraa-flashbox-2879-rpc.a.stagenet.tanssi.network/api",
    },
  },
});

// Create wagmiConfig
const chains = [
  // mainnet,
  dotaEvmChain,
] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  transports: {
    [dotaEvmChain.id]: http(),
  },
  ssr: true,
  enableEmail: false,
});

export const croeConfig = createConfig({
  chains: [dotaEvmChain],
  transports: {
    [dotaEvmChain.id]: http(),
  },
});
