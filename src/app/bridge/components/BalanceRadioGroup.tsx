import React, { useState } from "react";
import styles from "../index.module.css";
import { useBadge } from "@nextui-org/react";
import useBridge from "../hooks/useBridge";

export interface BalanceRadioGroupOptions {
  label: string;
  value: number;
}

const options: BalanceRadioGroupOptions[] = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "100%", value: 1 },
];

const BalanceRadioGroup: React.FC<{
  type: "dot20" | "token";
}> = ({ type }) => {
  const bridge = useBridge();
  const data = bridge[type];

  const clickItem = (item: BalanceRadioGroupOptions) => {
    let val: BalanceRadioGroupOptions | undefined = item;
    if (item.value === data?.inputPercent) {
      val = undefined;
    }
    bridge.setValue({ type, data: { inputPercent: val?.value } });
  };

  return (
    <div className="flex space-x-2">
      {options.map((item) => (
        <div
          key={item.value}
          className={`${data?.inputPercent === item.value ? "bg-pink" : styles.btnGrayBg} px-3 py-1 text-sm rounded-full cursor-pointer`}
          onClick={() => clickItem(item)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default BalanceRadioGroup;
