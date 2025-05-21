import BigNumber from "bignumber.js";
import React, { useEffect, useCallback, useMemo, useState } from "react";
import { Button, Modal, Text } from "uikit";
import ModalActions from "./ModalActions";
import ModalInput from "./ModalInput";
import { useTranslation } from "context/Localization";
import { getFullDisplayBalance } from "utils/formatBalance";
import LogoLoading from "components/LogoLoading";

const WithdrawModal = ({
  isNFTPool,
  isNFTALL,
  setIsNFTALL,
  onConfirm,
  onDismiss,
  max,
  tokenName = "",
}) => {
  const [val, setVal] = useState("");
  const [valNumber, setValueNumber] = useState(new BigNumber(0));
  const [pendingTx, setPendingTx] = useState(false);
  const { t } = useTranslation();
  const fullBalance = useMemo(() => {
    return isNFTPool ? max : getFullDisplayBalance(max);
  }, [max]);

  const fullBalanceNumber = new BigNumber(fullBalance);

  const handleChange = useCallback(
    (e) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, "."));
        setValueNumber(new BigNumber(e.currentTarget.value.replace(/,/g, ".")))
      }
    },
    [setVal]
  );

  const handleSelectMax = () => {
    if (isNFTPool) {
      setIsNFTALL(true);
      setVal(fullBalance);
      setValueNumber(fullBalance)
    } else {
      setVal(fullBalance);
      setValueNumber(new BigNumber(fullBalance))
    }
  };
  useEffect(() => {
    setIsNFTALL(false)
  }, [])
  return (
    <>
      <Modal title={t("Unstake tokens")} onDismiss={onDismiss}>
        <ModalInput
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          value={val}
          max={fullBalance}
          isNFTPool={isNFTPool}
          symbol={tokenName}
          inputTitle={t("Unstake")}
        />
        <ModalActions>
          <Button
            variant="secondary"
            onClick={onDismiss}
            width="100%"
            disabled={pendingTx}
          >
            {t("Cancel")}
          </Button>
          <Button
            className="pulse_bg text-[white!important]"
            disabled={pendingTx ||
              !valNumber.isFinite() ||
              (!isNFTPool && valNumber.eq(0)) ||
              (!isNFTPool && valNumber.gt(fullBalanceNumber))}
            onClick={async () => {
              setPendingTx(true);
              await onConfirm(val);
              setIsNFTALL(false);
              setPendingTx(false);
              onDismiss();
            }}
            width="100%"
            style={{ alignSelf: "center", color: "white" }}
          >
            {t("Confirm")}
          </Button>
        </ModalActions>
      </Modal>
      {pendingTx && <LogoLoading title="Pending Confirmation..." />}
    </>
  );
};

export default WithdrawModal;
