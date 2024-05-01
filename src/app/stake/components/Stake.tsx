import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useConnectWallet } from "@/hooks/usePolkadot";
import { useState } from "react";

const Stake: React.FC = () => {
  const { selectedAccount, getApi, getInjectedAccount } = useConnectWallet();
  const [staking, setStaking] = useState(false);
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
    // if (balance <= 0 || val > balance) {
    //   return Error("Insufficient balance");
    // }
    return undefined;
  };

  const handleStake = async () => {
    setStaking(true);
    const isvalid = validprops();

    if (isvalid !== undefined) {
      setStaking(false);
      handleTransitionFail(isvalid);
      return;
    }

    try {
      const api = await getApi();
      const acc = selectedAccount;
      if (!api || !acc) {
        setStaking(false);
        handleTransitionFail(Error("Api or account login issues"));
        return;
      }
      const injector = await getInjectedAccount();
      if (!injector) {
        setStaking(false);
        handleTransitionFail(Error("Get injected account error"));
        return;
      }

      // api.tx.utility
      //   .batchAll(batchAll)
      //   .signAndSend(
      //     acc.address,
      //     { signer: injector.signer },
      //     (result: any) => {
      //       if (result.status.isInBlock) {
      //         handleTransition(result);
      //         setStaking(false);
      //       }
      //     }
      //   )
      //   .catch((error: any) => {
      //     setStaking(false);
      //     handleTransitionFail(error);
      //   });
    } catch (error) {
      setStaking(false);
      handleTransitionFail(error as Error);
    }
  };
  return (
    <>
      <Button
        isDisabled={!selectedAccount?.address}
        isLoading={staking}
        className={`btn btn-large mt-8 bg-pink-500 hover:bg-sky-700 color-white`}
        fullWidth
        size="lg"
        onClick={handleStake}
      >
        Stake
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

export default Stake;
