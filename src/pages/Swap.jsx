import React, { useState } from "react";
import { fromReadableAmount, getAllowance } from "utils";
import { useAccount, useNetwork } from "wagmi";
import { useEthersProvider, useEthersSigner } from "hooks/useEthers";
import { zapList } from "config/farms";
import { getZapAddress } from "utils/addressHelpers";
import { getErc20Contract, getLpContract } from "utils/contractHelpers";
import { didUserReject } from "utils/customHelpers";
import { ethers } from "ethers";
import { notify } from "utils/toastHelper";
import { RiExchangeDollarLine } from "react-icons/ri";
import TokenSelectModal from "components/TokenSelectModal";
import TokenSelect from "components/TokenSelect";
import Loading from "components/Loading";
import LogoLoading from "components/LogoLoading";
import useZap from "hooks/useZap";
import Zapper from "./zapper";

export default function Swap() {
  const signer = useEthersSigner();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useEthersProvider();
  const [status, setStatus] = useState({
    insufficientA: false,
    insufficientB: false,
    tokenA: false,
    tokenB: false,
    loading: false,
    swap: false,
    approve: false,
  });

  const [active, setActive] = useState(0);
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [tokenA, setTokenA] = useState(zapList[1]);
  const [tokenB, setTokenB] = useState(zapList[3]);
  const [tokenAAllowance, setTokenAAllowance] = useState(0);
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);
  const { onZap } = useZap();
  const zapAddress = getZapAddress();
  const [isApproving, setIsApproving] = useState(false);
  const [updateBalance, setUpdateBalance] = useState(false);

  const closeModalA = () => {
    setOpenA(false);
  };

  const closeModalB = () => {
    setOpenB(false);
  };

  const handleSetInsufficientA = (flag) => {
    setStatus({ ...status, insufficientA: flag });
  };

  const handleSetInsufficientB = (flag) => {
    setStatus({ ...status, insufficientB: flag });
  };

  const handleSetTokenAAvailable = (flag) => {
    setStatus({ ...status, tokenA: flag });
  };

  const handleSetTokenBAvailable = (flag) => {
    setStatus({ ...status, tokenB: flag });
  };

  const handleReverse = () => {
    const tempTokenA = tokenA;
    setTokenA(tokenB);
    setTokenB(tempTokenA);
    setTokenAAmount(tokenBAmount);
    checkAllowance(tokenB, "A");
  };

  const handleSetTokenA = (val) => {
    setTokenA(val);
    console.log(val);
    checkAllowance(val, "A");
  };

  const handleSetTokenB = (val) => {
    setTokenB(val);
  };

  const checkAllowance = async (token, type) => {
    if (token.lpSymbol !== "PLS") {
      setIsCheckingAllowance(true);
      const res = await getAllowance(address, token, zapAddress, provider);
      if (type === "A") {
        setTokenAAllowance(res);
      }
      setIsCheckingAllowance(false);
    } else {
      setStatus({ ...status, insufficientA: true });
    }
  };

  async function handleApprove() {
    if (Number(tokenAAmount) <= 0) {
      notify("error", "Please input the amount.");
      return;
    }

    try {
      if (Number(tokenAAllowance) < Number(tokenAAmount)) {
        console.log("approving...");
        setIsApproving(true);
        let tokenContract;
        if (tokenA.isTokenOnly) {
          tokenContract = getErc20Contract(tokenA.lpAddresses, signer);
        } else {
          tokenContract = getLpContract(tokenA.lpAddresses, signer);
        }
        const tx = await tokenContract.approve(
          zapAddress,
          ethers.constants.MaxUint256,
          { from: address }
        );
        await tx.wait();
        setIsApproving(false);
        checkAllowance(tokenA, "A");
      }
    } catch (e) {
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      } else {
        notify("error", e.reason);
      }
      setIsApproving(false);
    }
  }

  async function handleDeposit() {
    if (tokenA === tokenB || !tokenAAmount) return;
    try {
      setPendingTx(true);
      await onZap(
        tokenA.lpAddresses,
        tokenA.lpSymbol === "PLS" ? true : false,
        fromReadableAmount(Number(tokenAAmount)),
        tokenB.lpAddresses,
        tokenB.lpSymbol === "PLS" ? true : false
      );
      refreshData();
      setPendingTx(false);
    } catch (e) {
      console.log(e);
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      } else {
        notify("error", e.reason);
      }
      setPendingTx(false);
    }
  }

  const refreshData = () => {
    setTokenAAmount("");
    setUpdateBalance(true);
    checkAllowance(tokenA, "A");
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="fixed top-[44%] left-[15%] -z-10 w-full md:w-1/4 h-full opacity-10 duration-300">
        <svg 
          viewBox="0 0 400 400" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-full w-full"
        >
          <g opacity="0.8">
            <circle cx="200" cy="200" r="150" stroke="#b280ff" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="120" stroke="#8a3ffc" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="90" stroke="#ff6b2b" strokeWidth="1" fill="none" />
            
            <path 
              d="M200,50 L200,350 M50,200 L350,200" 
              stroke="#8a3ffc" 
              strokeWidth="0.5" 
              opacity="0.3"
            />
            
             <g className="rotate">
              <circle cx="140" cy="95" r="4" fill="#ff6b2b" />
              <circle cx="300" cy="140" r="4" fill="#8a3ffc" />
              <circle cx="200" cy="320" r="4" fill="#ff6b2b" />
              <circle cx="80" cy="200" r="4" fill="#8a3ffc" />
            </g>
          </g>
        </svg>
      </div>
      <div className="p-6 border border-[#292524] rounded-xl shadow-xl">
        <div className="tab">
          <div className="flex justify-center">
            <div className="tab_panel">
              <div
                className={`tab_button ${active === 0 ? "active" : ""}`}
                onClick={() => setActive(0)}
              >
                Zapper
              </div>
              <div
                className={`tab_button ${active === 1 ? "active" : ""}`}
                onClick={() => setActive(1)}
              >
                Swap
              </div>
            </div>
          </div>
          <div className="flex justify-center"></div>
        </div>
        {active === 0 ?(
          <Zapper />
        ):(
          <div>
            <div className="p-6 border border-[#292524] rounded-xl">
              <div className="border-b border-[#292524] mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1"></div>
                  <div className="flex-1 flex justify-center items-center">
                    <div className="block">
                      <h1 className="text-center text-symbol text-2xl font-semibold">
                        SWAP
                      </h1>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-end items-center">
                    <button
                      className="action_btn shadow-md hover:bg-primary  transition ease-in-out"
                      onClick={refreshData}
                    >
                      <img src="/assets/refresh.png" alt="" />
                    </button>
                  </div>
                </div>
                <p className="text-center text-gray-400 py-3">
                  Trade tokens in on instant.
                </p>
              </div>
              <TokenSelect
                type="A"
                token={tokenA}
                selectOnly={false}
                amount={tokenAAmount}
                setOpen={setOpenA}
                setAmount={setTokenAAmount}
                setStates={handleSetTokenAAvailable}
                setInsufficient={handleSetInsufficientA}
                updateBalance={updateBalance}
                setDirection={() => { }}
                tokenType=""
              />

              <div className="flex justify-center">
                  <button
                    onClick={handleReverse}
                    className="scale-100 hover:scale-110 transition ease-in-out"
                  >
                    <RiExchangeDollarLine className="text-3xl" />
                  </button>
              </div>
              <TokenSelect
                type="B"
                selectOnly={true}
                token={tokenB}
                amount={tokenBAmount}
                setOpen={setOpenB}
                setAmount={setTokenBAmount}
                setStates={handleSetTokenBAvailable}
                setInsufficient={handleSetInsufficientB}
                updateBalance={updateBalance}
                setDirection={() => { }}
                tokenType=""
              />

              {isCheckingAllowance ? (
                <button className="main_btn mt-8 hover:bg-symbolHover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg transition ease-in-out p-[8px] bg-secondary-700">
                  <Loading title="Loading..." />
                </button>
              ) : (tokenA.lpSymbol !== "PLS" && Number(tokenAAllowance) === 0) ||
                (tokenA.lpSymbol !== "PLS" &&
                  Number(tokenAAllowance) < Number(tokenAAmount)) ? (
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="main_btn mt-8 hover:bg-symbolHover disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg transition ease-in-out p-[8px] bg-secondary-700"
                >
                  Approve
                </button>
              ) : (
                <button
                  onClick={handleDeposit}
                  disabled={
                    (tokenA.lpSymbol !== "PLS" &&
                      Number(tokenAAllowance) < Number(tokenAAmount)) ||
                    status.insufficientA ||
                    pendingTx ||
                    isApproving
                  }
                  className="main_btn mt-8 hover:bg-symbolHover disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg transition ease-in-out p-[8px] bg-secondary-700"
                >
                  {`Swap ${tokenA.lpSymbol} into ${tokenB.lpSymbol}`}
                </button>
              )}
            </div>
            {/* TokenA modal */}
            <TokenSelectModal
              open={openA}
              closeModal={closeModalA}
              setToken={handleSetTokenA}
              disabledToken={tokenB?.lpSymbol}
              tokens={zapList}
            />
            {/* TokenB modal */}
            <TokenSelectModal
              open={openB}
              closeModal={closeModalB}
              setToken={handleSetTokenB}
              disabledToken={tokenA?.lpSymbol}
              tokens={zapList}
            />
          </div>
        )}
      </div>
      {pendingTx &&
        <LogoLoading title="Zapping..." />}
      {isApproving &&
        <LogoLoading title="Approving..." />}
    </div>
  );
}
