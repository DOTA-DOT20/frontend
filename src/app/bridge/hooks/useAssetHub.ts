const { ApiPromise, WsProvider } = require("@polkadot/api");
import { useConnectWallet } from "@/hooks/usePolkadot";
import BridgeConfig from "../config";
import { useState } from "react";

function useAssetHub() {
  const [asset, setAsset] = useState<number | undefined>();

  async function getAssetHubApi() {
    try {
      const provider = new WsProvider(BridgeConfig.ASSET_HUB_URL);
      return await ApiPromise.create({ provider });
    } catch (error) {}
  }

  async function getAsset(address?: string) {
    const api = await getAssetHubApi();

    if (api && address) {
      const result = await api.query.assets.account(
        BridgeConfig.ASSET_ID,
        address
      );
      if (result.toJSON() !== null) {
        const rjson = result.toJSON() as { balance: number };

        setAsset(rjson.balance ?? 0);
      } else {
        setAsset(0);
      }
    }
  }

  return {
    asset,
    getAsset,
  };
}

export default useAssetHub;
