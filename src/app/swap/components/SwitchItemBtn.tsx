import { useCallback } from "react";
import useSwap from "../hooks/useSwap";
import styles from "../index.module.css";

const SwitchItemBtn: React.FC = () => {
  const { data, switchItem } = useSwap("pay");
  const switchItemClick = useCallback(() => {
    switchItem();
  }, [data]);

  return <div className={styles.swapTickBtn} onClick={switchItemClick} />;
};

export default SwitchItemBtn;
