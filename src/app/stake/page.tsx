"use client";

import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Slider,
} from "@nextui-org/react";
import Stake from "./components/Stake";
import styles from "./index.module.css";

export default function Home() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="p-4 md:p-12">
      <h2 className={styles.title}>Stake Dota</h2>
      <p className={styles.subTitle}>
        Stake Dota and receive ERC20-Dota while staking.
      </p>
      {/* input card */}
      <div className={styles.content}>
        <Input
          size="lg"
          type="number"
          min={0}
          step={0.1}
          label="DOTA Amount"
          labelPlacement="outside"
          classNames={{
            label: "ml-3",
            input: "text-gray text-4xl",
          }}
        />
        <div className="w-full mt-5 pl-3 pr-3">
          <Slider
            size="sm"
            showTooltip
            disableThumbScale
            color="primary"
            classNames={{
              label: "text-gray text-xs",
              value: "text-gray text-xs",
              track: "bg-gray",
              mark: "text-gray text-xs",
            }}
            label="Available DOTA：100,000"
            getValue={(val) => `${val} %`}
            defaultValue={50}
          />
        </div>
        <Stake />
        <div className="mt-10">
          <div className="flex sm:flex-row flex-col justify-between mt-1">
            <span className="text-gray text-sm">You will receive</span>
            <span className="text-gray-light text-base">
              {(1765.89).toLocaleString("en-US")}{" "}
              <span className="text-gray text-xs">ERC-20 DOTA</span>
            </span>
          </div>
          <div className="flex sm:flex-row flex-col justify-between mt-1">
            <span className="text-gray text-sm">Exchange rate</span>
            <span className="text-gray-light text-base">
              1 <span className="text-gray text-xs">DOTA</span> = 1{" "}
              <span className="text-gray text-xs">ERC-20 DOTA</span>
            </span>
          </div>
          {/* <div className="flex sm:flex-row flex-col justify-between mt-1">
            <span className="text-gray text-xs">Max transaction cost</span>
            <span className="text-gray-light text-base">
              <span className="text-gray text-xs">$</span> 7.89
            </span>
          </div> */}
          <div className="flex sm:flex-row flex-col justify-between mt-1">
            <span className="text-gray text-sm">Reward fee</span>
            <span className="text-gray-light text-base">
              5.75 <span className="text-gray text-xs">%</span>
            </span>
          </div>
        </div>
      </div>
      {/* statistics card */}
      <div className="mt-10">
        <p className={styles.subTitle}>Statistics</p>
      </div>
      <div className={styles.content}>
        <div className="flex sm:flex-row flex-col justify-between mt-1">
          <span className="text-gray text-sm">Annual percentage rate</span>
          <span className="text-gray-light text-base">
            3.25 <span className="text-gray text-xs">%</span>
          </span>
        </div>
        <div className="flex sm:flex-row flex-col justify-between mt-1">
          <span className="text-gray text-sm">Total staked</span>
          <span className="text-gray-light text-base">
            178,987,654.67 <span className="text-gray text-xs">DOTA</span>
          </span>
        </div>
        <div className="flex sm:flex-row flex-col justify-between mt-1">
          <span className="text-gray text-sm">Stakers</span>
          <span className="text-gray-light text-base">58,977</span>
        </div>
      </div>
      {/* FAQ card */}
      <div className="mt-10">
        <p className={styles.subTitle}>FAQ</p>
      </div>
      <div className={styles.content}>
        <Accordion>
          <AccordionItem key="1" aria-label="Questions 1" title="Questions 1">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="2" aria-label="Questions 2" title="Questions 2">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="3" aria-label="Questions 3" title="Questions 3">
            {defaultContent}
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
