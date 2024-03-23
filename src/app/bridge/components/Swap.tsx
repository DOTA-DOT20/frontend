import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import useBridge from "../hooks/useBridge";
import { useConnectWallet } from "@/hooks/usePolkadot";
import { useState } from "react";
import { web3FromAddress } from "@polkadot/extension-dapp";

// The suggestions go in a.env file
const address = "5GsmAhN2dKuyijc5qkh9kPJPt8YBLkN1KmYf7QWbsPKhenJd";

const Swap: React.FC = () => {
  const { selectedAccount, getApi } = useConnectWallet();
  const [swaping, setSwaping] = useState(false);
  const { dot20 } = useBridge();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
    console.log(error);
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

  const validprops = (): boolean => {
    const val = dot20?.inputValue ? parseInt(dot20.inputValue) : 0;
    const balance = dot20?.balance ?? 0;
    if (val <= 0) {
      console.error("Please enter a number greater than 0");
      return false;
    }
    if (val > balance) {
      console.error("Insufficient balance");
      return false;
    }
    return true;
  };

  const handleSwap = async () => {
    setSwaping(true);
    const isvalid = validprops();
    if (!isvalid) {
      setSwaping(false);
      return;
    }
    const api = await getApi();
    const acc = selectedAccount;
    if (!api || !acc) {
      console.error("Api or account login issues");
      setSwaping(false);
      return;
    }
    const injector = await web3FromAddress(acc.address);
    const batchAll = [
      api.tx.balances.transferKeepAlive(address, 0),
      api.tx.system.remarkWithEvent(
        JSON.stringify({
          p: "dot-20",
          op: "transfer",
          tick: "DOTA",
          amt: parseInt(dot20!.inputValue!),
        })
      ),
    ];

    api.tx.utility
      .batchAll(batchAll)
      .signAndSend(acc.address, { signer: injector.signer }, (result: any) => {
        if (result.status.isInBlock) {
          handleTransition(result);
          setSwaping(false);
        }
      })
      .catch((error: any) => {
        setSwaping(false);
        handleTransitionFail(error);
      });
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
