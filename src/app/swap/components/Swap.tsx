import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useWalletInfo, useWeb3Modal } from "@web3modal/wagmi/react";
import React, { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import useSwap from "../hooks/useSwap";
import { SwapContractConfig } from "../config/SwapContractConfig";
import { DOTAContractConfig } from "../config/DOTAContractConfig";
import { USDTContractConfig } from "../config/USDTContractConfig";
import { getTrade } from "@/utils/uniswapUtils";
import { Percent, TradeType } from "@uniswap/sdk-core";
import useSwapTicks from "../hooks/useSwapTicks";

type SwapArgs = [
  bigint,
  bigint,
  [`0x${string}`, `0x${string}`],
  `0x${string}`,
  bigint,
];

const Swap: React.FC<{ callback: (hash: `0x${string}`) => void }> = ({
  callback,
}) => {
  const { open } = useWeb3Modal();

  const { address, isConnecting, isDisconnected, isConnected, isReconnecting } =
    useAccount();
  const [swaping, setSwaping] = useState(false);
  const { walletInfo } = useWalletInfo();
  const { data: payData, restInput: restPay } = useSwap("pay");
  const { data: receivedData, restInput: restRreceived } = useSwap("received");
  const { ticks } = useSwapTicks();
  const [swapArgs, setSwapArgs] = useState<SwapArgs>();

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
    data: approveHash,
    error: approveError,
    writeContract: writeApproveContract,
  } = useWriteContract();

  const {
    data: swapHash,
    error: swapError,
    writeContract: writeSwapContract,
  } = useWriteContract();

  const { isPending: approvePending, isSuccess: approveConfirmed } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  const { isPending: swapPending, isSuccess: swapConfirmed } =
    useWaitForTransactionReceipt({
      hash: swapHash,
    });

  const swapClick = useCallback(async () => {
    setSwaping(true);
    try {
      if (!address) {
        throw Error("Address is null");
      }
      const pNum = Number(payData?.inputValue ?? "0");
      if (pNum <= 0) {
        throw Error("Please input pay amout");
      }
      const rNum = Number(receivedData?.inputValue ?? "0");
      if (rNum <= 0) {
        throw Error("Please input received amout");
      }
      if (!ticks) {
        throw Error("Please select token");
      }
      const trade = await getTrade({
        tick: ticks,
        act: payData!.token!,
        amount: BigInt(pNum * Math.pow(10, 18)),
      });

      const inputAmt = BigInt(
        Number(trade.inputAmount.toExact()) * Math.pow(10, 18)
      );

      const minAmt = BigInt(
        Number(trade.minimumAmountOut(new Percent("50", "1000")).toExact()) *
          Math.pow(10, 18)
      );
      setSwapArgs([
        inputAmt,
        minAmt,
        payData!.token! === "dota"
          ? [DOTAContractConfig.address, USDTContractConfig.address]
          : [USDTContractConfig.address, DOTAContractConfig.address],
        address,
        BigInt(Math.floor(Date.now() / 1000) + 60 * 20),
      ]);
      writeApproveContract({
        ...(payData!.token! === "dota"
          ? DOTAContractConfig
          : USDTContractConfig),
        functionName: "approve",
        args: [SwapContractConfig.address, inputAmt],
      });
    } catch (error) {
      setSwaping(false);
      setSwapArgs(undefined);
      handleTransitionFail(error as Error);
    }
  }, [address, payData, receivedData]);

  useEffect(() => {
    if (approveError) {
      setSwaping(false);
      setSwapArgs(undefined);
      handleTransitionFail(approveError);
    }
  }, [approveError]);

  useEffect(() => {
    if (swapError) {
      setSwaping(false);
      setSwapArgs(undefined);
      handleTransitionFail(swapError);
    }
  }, [swapError]);

  useEffect(() => {
    if (approveConfirmed) {
      if (swapArgs === undefined) {
        setSwaping(false);
        handleTransitionFail(Error("Args Error"));
        return;
      }
      writeSwapContract({
        ...SwapContractConfig,
        functionName: "swapExactTokensForTokens",
        args: swapArgs,
      });
    }
  }, [approveConfirmed]);

  useEffect(() => {
    if (swapConfirmed) {
      setSwaping(false);
      setSwapArgs(undefined);
      restPay();
      restRreceived();
      handleTransition(swapHash);
      callback(swapHash!);
    }
  }, [swapConfirmed]);

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

  if (address) {
    return (
      <>
        <Card className="mt-10 rounded-3xl">
          <div className="flex flex-wrap p-5 justify-between">
            <w3m-account-button balance="hide" />
            <div className="flex flex-row flex-wrap content-center">
              <span className="text-gray text-sm">{walletInfo?.name}</span>
              <div className="flex flex-wrap content-center ml-1">
                <img width={16} src={walletInfo?.icon} />
              </div>
            </div>
          </div>
          <Button
            isDisabled={!address || !isConnected}
            isLoading={isConnecting || swaping}
            size="lg"
            radius="none"
            fullWidth
            onClick={swapClick}
          >
            {swaping
              ? `Waiting for ${approvePending ? "approve" : swapPending ? "swap" : "transaction"}……`
              : "Swap"}
            {swaping
              ? approvePending
                ? " (1/2)"
                : swapPending
                  ? " (2/2)"
                  : ""
              : ""}
          </Button>
          <Modal
            backdrop="blur"
            isOpen={modalInfo.open}
            onClose={handleModalClose}
          >
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
        </Card>
      </>
    );
  }

  if (isConnecting || isDisconnected || isReconnecting) {
    return (
      <>
        <Button
          isLoading={isConnecting || isReconnecting}
          className={`btn btn-large mt-10 bg-pink-500 hover:bg-sky-700 color-white`}
          fullWidth
          size="lg"
          onClick={() => open({ view: "Connect" })}
        >
          {isDisconnected ? "Connect Wallet" : "Connecting"}
        </Button>
      </>
    );
  }

  return <></>;
};

export default Swap;
