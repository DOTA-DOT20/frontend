import { useEffect } from "react";
import { Input } from "@nextui-org/react";
import BalanceRadioGroup from "./BalanceRadioGroup";
import SelectTick from "./SelectTick";
import { useConnectWallet } from "@/hooks/usePolkadot";
import { requestBalance } from "@/request";
import { formatNumberWithCommas } from "@/utils/format";
import styles from "../index.module.css";
import useBridge from "../hooks/useBridge";

const Dot20Card: React.FC = () => {
  const { selectedAccount } = useConnectWallet();
  const [{ data }, getBalance] = requestBalance();
  const { dot20, setValue } = useBridge();

  useEffect(() => {
    if (selectedAccount?.address && dot20?.tick) {
      getBalance({
        params: {
          account: selectedAccount.address,
          tick: dot20.tick,
        },
      });
    }
  }, [selectedAccount, dot20?.tick]);

  useEffect(() => {
    let b = 0;
    if (data?.balance && data.balance.length > 0) {
      b = parseInt(data.balance[0].available);
    }
    setValue({
      type: "dot20",
      data: { balance: b },
    });
  }, [data]);

  useEffect(() => {
    const calc = (dot20?.balance ?? 0) * (dot20?.inputPercent ?? 0);
    const calc1m = calc / Math.pow(10, 6);
    setValue({
      type: "dot20",
      data: {
        inputValue: `${calc1m}`,
      },
    });
  }, [dot20?.balance, dot20?.inputPercent]);

  const handleInputChange = (event: any) => {
    setValue({ type: "dot20", data: { inputValue: event.target.value } });
  };

  return (
    <div className={`rounded-3xl px-6 py-5 ${styles.cardBg}`}>
      <div className="flex sm:flex-row flex-col justify-between">
        <div className="basis-2/3 flex flex-col justify-center">
          <Input
            className="my-3"
            type="number"
            min={1}
            step={0.1}
            style={{ fontSize: 32 }}
            value={dot20?.inputValue}
            onChange={handleInputChange}
            placeholder="quantity"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">1,000,000</span>
              </div>
            }
          />
          <BalanceRadioGroup type="dot20" />
        </div>
        <div className="flex flex-col justify-center sm:m-0 mt-3">
          <SelectTick type="dot20" />
          <span className="text-sm mt-3 text-right text-gray">
            Balance:
            {dot20?.balance !== undefined
              ? formatNumberWithCommas(dot20.balance)
              : "~"}{" "}
            {dot20?.tick ? dot20.tick.toUpperCase() : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dot20Card;
