import { Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useMemo } from "react";
import useSwap from "../hooks/useSwap";
import useCalcSwap from "../hooks/useCalcSwap";

export interface TokenOption {
  label: string;
  value: "dota" | "usdt";
}

const optionsData: TokenOption[] = [
  {
    label: "DOTA（erc-20)",
    value: "dota",
  },
  {
    label: "USDT（erc-20)",
    value: "usdt",
  },
];

const SelectToken: React.FC<{ type: "pay" | "received" }> = ({ type }) => {
  const { data, setValue } = useSwap(type);
  const { data: otherData } = useSwap(type === "pay" ? "received" : "pay");
  const { setOtherTokenInput } = useCalcSwap(type);

  const options = useMemo<TokenOption[]>(
    () => optionsData.filter((item) => item.value !== otherData?.token),
    [type, data, otherData]
  );

  const handleSelect = (keys: any) => {
    const key = Array.from(keys)[0] as string;
    const item = options.find((item) => item.value === key);

    if (!item) return;
    if (item.value === data?.token) return;
    setValue({ type: type, data: { token: item.value } });
    if (
      (!data?.inputValue || data?.inputValue === "") &&
      otherData?.inputValue &&
      otherData?.inputValue !== ""
    ) {
      setOtherTokenInput(otherData.inputValue);
    }
  };

  useEffect(() => {
    if (type === "pay") {
      setValue({ type, data: { token: options[0].value } });
    }
  }, []);

  return (
    <Select
      classNames={{
        mainWrapper: "text-white bg-pink rounded-3xl",
      }}
      aria-label="Select a token"
      placeholder="Select a token"
      selectedKeys={data?.token ? [data!.token] : []}
      onSelectionChange={handleSelect}
    >
      {options.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SelectToken;
