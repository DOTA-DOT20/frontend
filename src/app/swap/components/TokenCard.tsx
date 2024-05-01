import styles from "../index.module.css";
import { Input } from "@nextui-org/react";
import SelectToken from "./SelectToken";
import useSwap from "../hooks/useSwap";
import { useAccount } from "wagmi";
import Balance from "./Balance";
import useCalcSwap from "../hooks/useCalcSwap";

const labels = {
  pay: "Pay",
  received: "Received",
};

const TokenCard: React.FC<{ type: "pay" | "received" }> = ({ type }) => {
  const { data, setValue } = useSwap(type);
  const { address } = useAccount();
  const { setOtherTokenInput } = useCalcSwap(type);

  const handleInputChange = (event: any) => {
    setValue({ type, data: { inputValue: event.target.value } });
    setOtherTokenInput(event.target.value);
  };

  return (
    <div className={`rounded-3xl px-6 py-5 ${styles.cardBg}`}>
      <div className="flex sm:flex-row flex-col justify-between content-center flex-wrap">
        <div className="basis-3/5 flex flex-col justify-center">
          <Input
            size="lg"
            type="number"
            min={0}
            step={0.1}
            label={labels[type]}
            value={data?.inputValue}
            onChange={handleInputChange}
            classNames={{
              input: "text-gray text-3xl",
              label:
                "text-2xl group[data-filled-within=true] group-data-[filled-within=true]:scale-50 group-data-[filled-within=true]:-translate-y-[calc(50%_+_theme(fontSize.small)/2_+2px)]",
            }}
          />
        </div>
        <div className="basis-2/5 flex flex-col justify-center sm:m-0 mt-5">
          <SelectToken type={type} />
          {address && data?.token ? (
            <Balance token={data!.token} address={address} />
          ) : undefined}
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
