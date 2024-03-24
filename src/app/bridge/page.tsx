"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";

import styles from "./index.module.css";
import TickCard from "./components/TickCard";
import tipsIcon from "@/icons/tips.svg";
import stellaswapIcon from "@/icons/stellaswap.svg";
import dexscreenerIcon from "@/icons/dexscreener.png";
import Total from "./components/Total";
import Swap from "./components/Swap";

import { BridgeRoot } from "./hooks/BridgeRoot";

export default function Home() {
  return (
    <BridgeRoot>
      <div className="p-4 md:p-12">
        <h2 className={styles.title}>Dota lnscribe Token Bridge</h2>
        <p className={styles.subTitle}>Swap Dota as token</p>
        <div className={styles.content}>
          <h2 className="text-center mb-5">Bridge</h2>
          <TickCard type="dot20" />
          <div className={`mt-2 ${styles.swapTickBox}`}>
            <TickCard type="token" />
          </div>
          <div className="flex flex-row justify-between mt-3 text-sm">
            <span>1 DOTA (dot-20) = 1 DOTA (token)</span>
            <span>Fee:5%</span>
          </div>
          <Swap />
          <div className="mt-5 flex flex-row content-center">
            <Image src={tipsIcon} width={16} height={16} alt="tips" />
            <p className="text-xs text-gray ml-1.5">
              To swap Dota(token) to Dota (dot-20) or vice versa, you need a
              minimum of 10.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <Total />
        </div>
        <div
          className={`mt-5 mb-32 max-w-screen-md text-sm flex sm:flex-row flex-col sm:space-x-5 mx-auto`}
        >
          <Button
            radius="full"
            className={`sm:w-1/2 ${styles.btnGrayBg} hover:bg-sky-700 color-white`}
            startContent={
              <Image src={stellaswapIcon} width={24} height={24} alt="tips" />
            }
          >
            Trade on Stellaswap
          </Button>
          <Button
            radius="full"
            className={`sm:w-1/2 sm:mt-0 mt-3 ${styles.btnGrayBg} hover:bg-sky-700 color-white`}
            startContent={
              <Image src={dexscreenerIcon} width={24} height={24} alt="tips" />
            }
          >
            View on Dexscreener
          </Button>
        </div>
      </div>
    </BridgeRoot>
  );
}
