import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { DOTAContractConfig } from "../config/DOTAContractConfig";
import { USDTContractConfig } from "../config/USDTContractConfig";
import { FaucetContractConfig } from "../config/FaucetContractConfig";
import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { formatToken } from "@/utils/format";

const contractConfig = {
  dota: DOTAContractConfig,
  usdt: USDTContractConfig,
};
const Balance: React.FC<{ token: "dota" | "usdt"; address: `0x${string}` }> = ({
  token,
  address,
}) => {
  const [minting, setMinting] = useState(false);
  const [modalInfo, setModalInfo] = useState<{
    open: boolean;
    title: string;
    content: string | React.ReactNode;
  }>({
    open: false,
    title: "",
    content: "",
  });

  const {
    data,
    isPending: loading,
    refetch,
  } = useReadContract({
    ...contractConfig[token],
    functionName: "balanceOf",
    args: [address],
  });

  const { refetch: recordRefetch, data: record } = useReadContract({
    ...FaucetContractConfig,
    functionName: "record",
    args: [contractConfig[token].address, address],
  });

  const { data: hash, error, writeContract } = useWriteContract();

  const mint = useCallback(() => {
    try {
      setMinting(true);
      writeContract({
        ...FaucetContractConfig,
        functionName: "mint",
        args: [contractConfig[token].address],
      });
    } catch (error) {
      setMinting(false);
      handleTransitionFail(error as Error);
    }
  }, [token, address]);

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (error) {
      setMinting(false);
      handleTransitionFail(error);
    }
  }, [error]);

  useEffect(() => {
    if (isConfirmed) {
      setMinting(false);
      refetch();
      recordRefetch();
      handleTransition(hash);
    }
  }, [isConfirmed]);

  const handleTransition = (result: any) => {
    const url = `https://evmexplorer.tanssi-chains.network/tx/${result}?rpcUrl=https%3A%2F%2Ffraa-flashbox-2879-rpc.a.stagenet.tanssi.network`;
    setModalInfo({
      open: true,
      title: "Transition Success",
      content: (
        <>
          <p>
            Transaction successful, please wait for the Explorer to confirm.
          </p>
          {result && (
            <a href={url} target="_blank">
              Tanssi Basic EVM Explorer
            </a>
          )}
        </>
      ),
    });
  };

  const handleTransitionFail = (error: Error) => {
    setModalInfo({
      open: true,
      title: "Transition Fail",
      content: (
        <>
          <p>{error.message}</p>
        </>
      ),
    });
  };

  const handleModalClose = () => {
    setModalInfo((info) => {
      return {
        ...info,
        open: false,
      };
    });
  };

  return (
    <>
      <span className="text-sm mt-1 text-right text-gray">
        {loading} balance:{" "}
        {data !== undefined ? `${formatToken(Number(data), 18)}` : "~"}
        {" " + token.toUpperCase()}
        {record !== undefined && record === BigInt(0) ? (
          <Button
            className="ml-2 mt-1"
            size="sm"
            variant="bordered"
            radius="full"
            isLoading={minting}
            onClick={mint}
          >
            Faucet
          </Button>
        ) : null}
      </span>

      <Modal backdrop="blur" isOpen={modalInfo.open} onClose={handleModalClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 color-green">
                {modalInfo.title}
              </ModalHeader>
              <ModalBody>{modalInfo.content}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Balance;
