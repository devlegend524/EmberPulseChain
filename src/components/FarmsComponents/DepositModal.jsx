import React, { useEffect, useCallback, useMemo, useState } from "react";
import Modal from "react-modal";
import { Button, Skeleton } from "uikit";
import BigNumber from "bignumber.js";
import ModalActions from "./ModalActions";
import ModalInput from "./ModalInput";
import { useTranslation } from "context/Localization";
import { getFullDisplayBalance } from "utils/formatBalance";
import LogoLoading from "components/LogoLoading";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#09090b",
    color: "white",
    border: "none",
  },
};

const DepositModal = ({
  open,
  closeModal,
  max,
  isNFTPool,
  isNFTALL,
  setIsNFTALL,
  onConfirm,
  onDismiss,
  tokenName = "",
  addLiquidityUrl,
  decimals = 18,
  depositFee,
  tokenInfo,
}) => {
  const [val, setVal] = useState("");
  const [valNumber, setValueNumber] = useState(new BigNumber(0));

  const [lockPeriod, setLockPeriod] = useState(0);
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
        setValueNumber(new BigNumber(e.currentTarget.value.replace(/,/g, ".")));
      }
    },
    [setVal]
  );

  const handleSelectMax = () => {
    if (isNFTPool) {
      setIsNFTALL(true);
      setVal(fullBalance);
      setValueNumber(fullBalance);
    } else {
      setVal(fullBalance);
      setValueNumber(new BigNumber(fullBalance));
    }
  };

  useEffect(() => {
    setIsNFTALL(false);
  }, []);
  return (
    <>
      <div className="fixed top-[26%] left-[39%] z-20  rounded-full h-[60px] w-[60px] bg-[#3f128d] blur-2xl"></div>
      <div className="fixed top-[73%] md:top-[65%] left-[57%] z-20  rounded-full h-[80px] w-[80px] bg-[#972a09e8] blur-3xl"></div>
      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="min-w-[350px] max-w-[500px] w-full p-10 rounded-xl">
          <ModalInput
            value={val}
            onSelectMax={handleSelectMax}
            onChange={handleChange}
            max={fullBalance}
            isNFTPool={isNFTPool}
            symbol={tokenName}
            addLiquidityUrl={addLiquidityUrl}
            inputTitle={t("Stake")}
            decimals={decimals}
            tokenInfo={tokenInfo}
          />
          <div className="flex gap-3 mt-12">
            <button
              className="border border-gray-600 w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px]"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                setPendingTx(true);
                await onConfirm(val, lockPeriod);
                setIsNFTALL(false);
                setPendingTx(false);
                onDismiss();
              }}
              className="banner_btn disabled:opacity-50 disabled:hover:scale-100 w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] "
              disabled={
                pendingTx ||
                !valNumber.isFinite() ||
                (!isNFTPool && valNumber.eq(0)) ||
                (!isNFTPool && valNumber.gt(fullBalanceNumber))
              }
            >
              {t("Confirm")}
            </button>
          </div>
        </div>
      </Modal>
      {pendingTx && <LogoLoading title="Pending Confirmation..." />}
    </>
  );
};

export default DepositModal;
