import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import arrowIcon from "@/icons/arrow-down.svg";
import useBridge from "../hooks/useBridge";

export interface TickOptions {
  label: string;
  value: string;
}
const optionsData = {
  dot20: [
    {
      label: "DOTA（dot-20)",
      value: "DOTA",
    },
  ],
  token: [
    {
      label: "DOTA（token)",
      value: "DOTA",
    },
  ],
};

const SelectTick: React.FC<{
  type: "dot20" | "token";
}> = ({ type }) => {
  const bridge = useBridge();
  const data = bridge[type];
  const options = optionsData[type];

  const handleSelect = (keys: any) => {
    const key = Array.from(keys)[0] as string;
    const item = options.find((item) => item.value === key);

    if (!item) return;
    if (item.value === data?.tick) return;
    bridge.setValue({ type, data: { tick: item.value } });
  };

  const getLabel = useMemo(
    () => options.find((item) => item.value === data?.tick),
    [data]
  );

  return (
    <Dropdown className="w-2">
      <DropdownTrigger>
        <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 color-white">
          <span>{getLabel?.label}</span>
          <Image src={arrowIcon} width={12} height={12} alt="arrow" />
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Select token"
        variant="flat"
        selectionMode="single"
        defaultSelectedKeys={options[0].value}
        onSelectionChange={handleSelect}
      >
        {options.map((item) => (
          <DropdownItem key={item.value}>{item.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SelectTick;
