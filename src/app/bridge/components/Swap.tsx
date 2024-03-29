import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import useBridge from "../hooks/useBridge";
import { useConnectWallet } from "@/hooks/usePolkadot";
import { useState } from "react";
import BridgeConfig from "../config";

const Swap: React.FC = () => {
  const { selectedAccount, getApi, getInjectedAccount } = useConnectWallet();
  const [swaping, setSwaping] = useState(false);
  const { dot20 } = useBridge();
  const [modalInfo, setModalInfo] = useState<{
    open: boolean;
    title: string;
    content: string | React.ReactNode;
  }>({
    open: false,
    title: "",
    content: "",
  });

  const handleTransition = (result: any) => {
    const hash = result.txHash;
    const url = `https://polkadot.subscan.io/extrinsic/${hash}`;
    setModalInfo({
      open: true,
      title: "Transition Success",
      content: (
        <>
          <p>Transaction successful, please wait for the indexer to confirm.</p>
          {hash && (
            <a href={url} target="_blank">
              Subscan
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
          <p>{error.toString()}</p>
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

  const validprops = (): Error | undefined => {
    if (
      dot20?.inputValue === undefined ||
      dot20?.inputValue === "" ||
      dot20!.inputValue!.length <= 0
    ) {
      return Error("Please input quantity");
    }
    const val = parseFloat(dot20!.inputValue!) * Math.pow(10, 6);
    const balance = dot20?.balance ?? 0;
    if (val < 1 * Math.pow(10, 6)) {
      return Error("need a minimum of 1,000,000");
    }

    if (balance <= 0 || val > balance) {
      return Error("Insufficient balance");
    }
    return undefined;
  };

  const handleSwap = async () => {
    setSwaping(true);
    const isvalid = validprops();

    if (isvalid !== undefined) {
      setSwaping(false);
      handleTransitionFail(isvalid);
      return;
    }

    try {
      const api = await getApi();
      const acc = selectedAccount;
      if (!api || !acc) {
        setSwaping(false);
        handleTransitionFail(Error("Api or account login issues"));
        return;
      }
      const injector = await getInjectedAccount();
      if (!injector) {
        setSwaping(false);
        handleTransitionFail(Error("Get injected account error"));
        return;
      }
      const batchAll = [
        api.tx.balances.transferKeepAlive(BridgeConfig.BROKER_ADDRESS, 0),
        api.tx.system.remarkWithEvent(
          JSON.stringify({
            p: "dot-20",
            op: "transfer",
            tick: "DOTA",
            amt: parseFloat(dot20!.inputValue!) * Math.pow(10, 6),
          })
        ),
      ];

      api.tx.utility
        .batchAll(batchAll)
        .signAndSend(
          acc.address,
          { signer: injector.signer },
          (result: any) => {
            if (result.status.isInBlock) {
              handleTransition(result);
              setSwaping(false);
            }
          }
        )
        .catch((error: any) => {
          setSwaping(false);
          handleTransitionFail(error);
        });
    } catch (error) {
      setSwaping(false);
      handleTransitionFail(error as Error);
    }
  };
  return (
    <>
      <Button
        isDisabled={!selectedAccount?.address}
        isLoading={swaping}
        className={`btn btn-large mt-10 bg-pink-500 hover:bg-sky-700 color-white`}
        fullWidth
        size="lg"
        onClick={handleSwap}
      >
        Swap
      </Button>
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

export default Swap;
