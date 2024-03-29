import { useEffect, useMemo } from "react";
import { Input } from "@nextui-org/react";
import BalanceRadioGroup from "./BalanceRadioGroup";
import SelectTick from "./SelectTick";
import { useConnectWallet } from "@/hooks/usePolkadot";
import { requestBalance } from "@/request";
import { formatNumberWithCommas } from "@/utils/format";
import styles from "../index.module.css";
import useBridge from "../hooks/useBridge";
import useAssetHub from "../hooks/useAssetHub";

const TokenCard: React.FC = () => {
  const { selectedAccount } = useConnectWallet();
  const { asset, getAsset } = useAssetHub();
  const { token, dot20, setValue } = useBridge();

  useEffect(() => {
    if (selectedAccount?.address && token?.tick) {
      getAsset(selectedAccount.address);
    }
  }, [selectedAccount, token?.tick]);

  useEffect(() => {
    setValue({
      type: "token",
      data: { balance: asset },
    });
  }, [asset]);

  useEffect(() => {
    if (dot20?.inputValue === "" || dot20?.inputValue?.length === 0) {
      setValue({
        type: "token",
        data: { inputValue: undefined },
      });
    } else {
      const res = parseFloat(dot20?.inputValue ?? "0") * Math.pow(10, 6);
      setValue({
        type: "token",
        data: { inputValue: `${res}` },
      });
    }
  }, [dot20?.inputValue]);

  return (
    <div className={`rounded-3xl px-6 py-5 ${styles.cardBg}`}>
      <div className="flex sm:flex-row flex-col justify-between">
        <div className="basis-2/3 flex flex-col justify-center">
          <h2 className="my-3" style={{ fontSize: 32 }}>
            {formatNumberWithCommas(parseFloat(token?.inputValue ?? "0"))}
          </h2>
        </div>
        <div className="flex flex-col justify-center sm:m-0 mt-3">
          <SelectTick type="token" />

          <span className="text-sm mt-3 text-right text-gray">
            Balance:
            {token?.balance !== undefined
              ? formatNumberWithCommas(token.balance)
              : "~"}{" "}
            {token?.tick ? token.tick.toUpperCase() : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
