import React, { useState, useEffect } from "react";
import { Skeleton } from "uikit";
import BigNumber from "bignumber.js";
import Balance from "components/Balance";
import { BIG_ZERO } from "utils/bigNumber";
import { getBalanceAmount } from "utils/formatBalance";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/farms";
import { usePricepWiLDUsdc } from "state/hooks";
import { useHarvest } from "hooks/useHarvest";
import { useTranslation } from "context/Localization";
import { Earned } from "./styles";
import { Tooltip } from "react-tooltip";
import Loading from "components/Loading";
import { notify } from "utils/toastHelper";
import { useAccount } from "wagmi";
import ZapInModal from "components/ZapInModal";
import CompoundModal from "components/CompoundModal";
import { didUserReject } from "utils/customHelpers";
import { useMasterchef } from "hooks/useContract";
import LogoLoading from "components/LogoLoading";

const HarvestAction = ({ pid, userData, userDataReady, isNFTPool }) => {
  const [pendingCompoundTx, setCompoundPendingTx] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);
  const [earnings, setEarnings] = useState(BIG_ZERO);
  const [earningsUsdt, setEarningsUsdt] = useState(0);
  const [open, setOpen] = useState(false);
  const [openCompound, setOpenCompound] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(
    userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />
  );
  const { onReward } = useHarvest(pid);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const wildPrice = usePricepWiLDUsdc()[0];
  const masterChefContract = useMasterchef();

  useEffect(() => {
    const earningsBigNumber = new BigNumber(userData.earnings);
    // If user didn't connect wallet default balance will be 0
    if (!earningsBigNumber.isZero()) {
      setEarnings(getBalanceAmount(earningsBigNumber));
      setEarningsUsdt(earnings.multipliedBy(wildPrice).toNumber());
      setDisplayBalance(earnings.toFixed(3, BigNumber.ROUND_DOWN));
    }
  }, [userData.earnings, userDataReady]);

  async function handleHavest() {
    try {
      setPendingTx(true);
      const res = await onReward(false);
      console.log("harvest", res);
      if (res === false) {
        setPendingTx(false);
        return;
      }
      dispatch(fetchFarmUserDataAsync({ address, pids: [pid] }));
      setPendingTx(false);
    } catch (e) {
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      } else {
        notify("error", e.reason);
      }
      setPendingTx(false);
    }
  }

  // async function handleCompound() {
  //   try {
  //     setCompoundPendingTx(true)
  //     await harvestMany(masterChefContract, [pid], true, address)
  //     notify('success', 'You have successfully claimed pWiLD tokens')
  //     dispatch(fetchFarmUserDataAsync({ address, pids: [pid] }))
  //     setCompoundPendingTx(false)
  //   } catch (e) {
  //     if (didUserReject(e)) {
  //       notify('error', 'User rejected transaction')
  //     }
  //     setCompoundPendingTx(false)
  //   }
  // }

  function openCompoundModal() {
    console.log(pid);
    setOpenCompound(true);
  }
  function closeCompoundModal() {
    setOpenCompound(false);
  }
  function openModal() {
    console.log(pid);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <div className="flex flex-row items-center justify-between gap-4 p-2 w-full">
      <div className="flex flex-col justify-between gap-2 w-full">
        <div className="text-white text-md font-semibold">
          EMBER &nbsp;
          {t("Earned")}
        </div>
        <div className="flex justify-start items-center">
          <div className="mr-20">
            <Earned>{displayBalance}</Earned>
          {earningsUsdt > 0.00 && (
            <Balance
              fontSize="14px"
              color="white"
              decimals={2}
              value={earningsUsdt}
              unit=" USD"
              prefix="~"
            />
          )}
          </div>
          <div className="flex justify-center gap-3">
            <button
              disabled={earnings.eq(0) || pendingTx || !userDataReady}
              onClick={handleHavest}
              className="rounded-3xl px-3 text-center text-white banner_btn "
            >
              {t(`Harvest`)}
            </button>

            {!isNFTPool && (
              <>
                <button
                  className="rounded-3xl w-full px-3 text-center text-white banner_btn hover:bg-symbolHover"
                  data-tooltip-id="compound-tooltip"
                  data-tooltip-content={
                    earnings.eq(0) || pendingCompoundTx || !userDataReady
                      ? "Stake tokens first to use it"
                      : "Restake your EMBER profit to EMBER pool"
                  }
                  disabled={
                    earnings.eq(0) || pendingCompoundTx || !userDataReady
                  }
                  onClick={openCompoundModal}
                >
                  {t(`Compound`)}
                </button>
                <button
                  className="rounded-3xl w-full px-3 text-white text-center banner_btn hover:bg-symbolHover"
                  data-tooltip-id="zap-tooltip"
                  data-tooltip-content="Stake to this pool from your wallet"
                  disabled={!userDataReady}
                  onClick={openModal}
                >
                  {t("Zap in")}
                </button>
              </>
            )}

            <Tooltip id="compound-tooltip" />
            <Tooltip id="zap-tooltip" />
          </div>
        </div>
      </div>

      {open && <ZapInModal open={open} closeModal={closeModal} pid={pid} />}
      {openCompound && (
        <CompoundModal
          open={openCompound}
          closeModal={closeCompoundModal}
          earnings={earnings}
          pid={[pid]}
          isAll={false}
        />
      )}

      {pendingTx && <LogoLoading title="Harvesting..." />}
      {pendingCompoundTx && <Loading title="Compounding..." />}
    </div>
  );
};

export default HarvestAction;
