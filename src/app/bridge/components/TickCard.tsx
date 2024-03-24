import { useEffect, useMemo } from "react";
import { Input } from "@nextui-org/react";
import BalanceRadioGroup from "./BalanceRadioGroup";
import SelectTick from "./SelectTick";
import { useConnectWallet } from "@/hooks/usePolkadot";
import { requestBalance } from "@/request";
import { formatNumberWithCommas } from "@/utils/format";
import styles from "../index.module.css";
import useBridge from "../hooks/useBridge";

const TickCard: React.FC<{
  type: "dot20" | "token";
}> = ({ type }) => {
  const { selectedAccount } = useConnectWallet();
  const [{ data }, getBalance] = requestBalance();
  const bridge = useBridge();
  const bridgeInfo = bridge[type];

  useEffect(() => {
    if (selectedAccount?.address && bridgeInfo?.tick) {
      if (type === "dot20") {
        getBalance({
          params: {
            account: selectedAccount.address,
            tick: bridgeInfo.tick,
          },
        });
      }
    }
  }, [selectedAccount, bridgeInfo?.tick]);

  useEffect(() => {
    let b = 0;
    if (data?.balance && data.balance.length > 0) {
      b = parseInt(data.balance[0].available);
    }
    bridge.setValue({
      type,
      data: { balance: b },
    });
  }, [data]);

  useEffect(() => {
    const calc = (bridgeInfo?.balance ?? 0) * (bridgeInfo?.inputPercent ?? 0);
    bridge.setValue({
      type,
      data: {
        inputValue: `${calc}`,
      },
    });
  }, [bridgeInfo?.balance, bridgeInfo?.inputPercent]);

  const handleInputChange = (event: any) => {
    bridge.setValue({ type, data: { inputValue: event.target.value } });
  };

  useEffect(() => {
    if (type === "token") {
      const res =
        (bridge.dot20?.inputValue ? parseFloat(bridge.dot20?.inputValue) : 0) *
        1;
      bridge.setValue({
        type: "token",
        data: { inputValue: `${res}` },
      });
    }
  }, [bridge.dot20?.inputValue]);

  return (
    <div className={`rounded-3xl px-6 py-5 ${styles.cardBg}`}>
      <div className="flex sm:flex-row flex-col justify-between">
        <div className="basis-2/3 flex flex-col">
          <Input
            className="my-3"
            style={{ fontSize: 32 }}
            value={bridgeInfo?.inputValue}
            onChange={type === "token" ? undefined : handleInputChange}
            readOnly={type === "token"}
            placeholder="0"
          />
          {type === "token" ? null : <BalanceRadioGroup type={type} />}
        </div>
        <div className="flex flex-col justify-center sm:m-0 mt-3">
          <SelectTick type={type} />
          {type === "token" ? null : (
            <span className="text-sm mt-5 text-right text-gray">
              Balance:
              {bridgeInfo?.balance !== undefined
                ? formatNumberWithCommas(bridgeInfo.balance)
                : "~"}{" "}
              {bridgeInfo?.tick ? bridgeInfo.tick.toUpperCase() : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TickCard;
