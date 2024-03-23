import { useConnectWallet } from "@/hooks/usePolkadot";
import { formatNumberWithCommas, shotAddress } from "@/utils/format";
import useBridge from "../hooks/useBridge";
import styles from "../index.module.css";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import copyIcon from "@/icons/copy.svg";

const Total: React.FC = () => {
  const { selectedAccount } = useConnectWallet();
  const { dot20 } = useBridge();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Text has been copied to the clipboard");
    } catch (err) {
      console.error("Unable to copy text: ", err);
    }
  };

  return (
    <div className={`${styles.content} text-sm`}>
      <div className="flex flex-row justify-between mt-3">
        <span>Token Address</span>
        <div>
          <span>
            {selectedAccount?.address
              ? shotAddress(selectedAccount.address)
              : "~"}
          </span>
          {selectedAccount?.address ? (
            <Button
              isIconOnly
              variant="light"
              onClick={() => handleCopy(selectedAccount.address)}
            >
              <Image src={copyIcon} width={14} height={14} alt="Copy" />
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-3">
        <span>Total</span>
        <span className="mr-10">
          {dot20?.balance !== undefined
            ? formatNumberWithCommas(dot20.balance)
            : "~"}
          {dot20?.balance !== undefined && dot20.tick
            ? ` ${dot20.tick.toUpperCase()}`
            : ""}
        </span>
      </div>
    </div>
  );
};

export default Total;
