"use client";

import styles from "./index.module.css";
import { cookieToInitialState } from "wagmi";
import Web3ModelRoot from "./hooks/Web3ModelRoot";
import { config } from "./config";
import Swap from "./components/Swap";
import TokenCard from "./components/TokenCard";
import { SwapRoot } from "./hooks/SwapRoot";
import SwitchItemBtn from "./components/SwitchItemBtn";
import { useCallback, useState } from "react";

export default function Home() {
  const initialState = cookieToInitialState(config);
  const [hash, setHash] = useState<`0x${string}`>();

  const back = useCallback((h: `0x${string}`) => setHash(h), []);

  return (
    <Web3ModelRoot initialState={initialState}>
      <SwapRoot>
        <div className="p-4 md:p-12">
          <h2 className={styles.title}>ERC-20 Dota Swap</h2>
          <p className={styles.subTitle}>Dota in the EVM-chain swap.</p>
          <div className={styles.content}>
            <TokenCard type="pay" key={hash} />
            <div className={`mt-2 ${styles.swapTickBox}`}>
              <SwitchItemBtn />
              <TokenCard type="received" key={hash} />
            </div>
            <Swap callback={back} />
          </div>
        </div>
      </SwapRoot>
    </Web3ModelRoot>
  );
}
