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
import { FaArrowRightLong } from "react-icons/fa6";
import TokenSelectModal from "components/TokenSelectModal";
import ZapTokenSelect from "components/ZapTokenSelect";
import Loading from "components/Loading";
import LogoLoading from "components/LogoLoading";
import useZap from "hooks/useZap";
import tokens from "config/tokens";
import addresses from "constants/addresses";
import { useAppDispatch } from "state";
import { useZapForFarm } from "hooks/useZap";
import { fetchFarmUserDataAsync } from "state/farms";

export default function Zapper({home=false}) {
  const tokensList = [
    {
      pid: 0,
      lpSymbol: "PLS",
      isTokenOnly: true,
      lpAddresses: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
      logoA: "/assets/tokens/pls.png",
      logoB: "",
    },
    {
      pid: 1,
      lpSymbol: "WPLS",
      isTokenOnly: true,
      lpAddresses: "0xA1077a294dDE1B09bB078844df40758a5D0f9a27",
      decimals: 18,
      logoA: "/assets/tokens/wpls.png",
      logoB: "",
    },
    {
      pid: 2,
      lpSymbol: "USDC",
      isTokenOnly: true,
      lpAddresses: tokens.usdc.address,
      decimals: 6,
      logoA: "/assets/tokens/usdc.svg",
      logoB: "",
    },
    {
      pid: 2,
      lpSymbol: "USDT",
      isTokenOnly: true,
      lpAddresses: tokens.usdt.address,
      decimals: 6,
      logoA: "/assets/tokens/usdt.svg",
      logoB: "",
    },
    {
      pid: 2,
      lpSymbol: "DAI",
      isTokenOnly: true,
      lpAddresses: tokens.dai.address,
      decimals: 18,
      logoA: "/assets/tokens/dai.svg",
      logoB: "",
    },
  ];
  const targetTokensList = [
    {
      pid: 0,
      lpSymbol: "EMBER-wPLS",
      lpAddresses: addresses.wildWplslp,
      isTokenOnly: false,
      isNFTPool: false,
      token: tokens.wild,
      quoteToken: tokens.wpls,
      logoA: tokens.wild.logo,
      logoB: tokens.wpls.logo,
    },
    {
      pid: 1,
      lpSymbol: "EMBER-PLSX",
      lpAddresses: addresses.wildWplslp,
      isTokenOnly: false,
      isNFTPool: false,
      token: tokens.wild,
      quoteToken: tokens.wpls,
      logoA: tokens.wild.logo,
      logoB: tokens.wpls.logo,
    },
    {
      pid: 2,
      lpSymbol: "EMBER-DAI",
      lpAddresses: addresses.wildWplslp,
      isTokenOnly: false,
      isNFTPool: false,
      token: tokens.wild,
      quoteToken: tokens.wpls,
      logoA: tokens.wild.logo,
      logoB: tokens.dai.logo,
    },
  ];
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

  const { onZapForFarm } = useZapForFarm();
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [tokenA, setTokenA] = useState(tokensList[0]);
  const [tokenB, setTokenB] = useState(targetTokensList[0]);
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
    if (tokenB.pid.length === 0) return;
    try {
      setPendingTx(true);
      await onZapForFarm(
        tokenA.lpAddresses,
        tokenA.lpSymbol === "PLS" ? true : false,
        fromReadableAmount(Number(tokenAAmount), tokenA.decimals),
        tokenB.lpAddresses,
        tokenB.pid
      );
      dispatch(fetchFarmUserDataAsync({ account: address, pids: tokenB.pid }));
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
    <>
      <div>
        <div className="p-6 rounded-xl relative container">
          <div className=" border-[#18181b] mb-6">
            <div className="flex justify-between items-center">
              <div className="flex-1"></div>
              <div className="flex-1 flex justify-center items-center">
                <div className="block">
                  <h1 className="text-center text-symbol text-3xl font-bold">
                    ZAPPER
                  </h1>
                </div>
              </div>
              <div className="flex-1 flex justify-end items-center">
                {!home ? <></>:<button
                  className="action_btn shadow-md hover:bg-primary  transition ease-in-out"
                  onClick={refreshData}
                >
                  <img src="/assets/refresh.png" alt="" />
                </button>}
              </div>
            </div>
            <p className="text-center text-gray-400 py-3">
              Easily swap between tokens and participate in yield farms with a
              single transaction.
            </p>
          </div>
          <div className="glass border border-[#19191b] rounded-3xl p-8 overflow-hidden">
            <div className="fixed -top-[2%] left-[93%] z-20  rounded-full h-[70px] w-[70px] bg-[#3f128d] blur-2xl"></div>
            <div className="fixed top-[80%] left-[1%] z-20  rounded-full h-[80px] w-[80px] bg-[#972a09e8] blur-3xl"></div>
            <div className="flex justify-between gap-10">
              <ZapTokenSelect
                type="A"
                token={tokenA}
                selectOnly={false}
                amount={tokenAAmount}
                setOpen={setOpenA}
                setAmount={setTokenAAmount}
                setStates={handleSetTokenAAvailable}
                setInsufficient={handleSetInsufficientA}
                updateBalance={updateBalance}
                setDirection={() => {}}
                tokenType=""
                input={true}
              />
              <div className="flex justify-center border border-[#19191b] rounded-full my-20 px-3 py-2 glass">
                <button className="scale-100 hover:scale-110 transition ease-in-out">
                  <FaArrowRightLong className="text-2xl" />
                </button>
              </div>
              <ZapTokenSelect
                type="B"
                selectOnly={true}
                token={tokenB}
                amount={tokenBAmount}
                setOpen={setOpenB}
                setAmount={setTokenBAmount}
                setStates={handleSetTokenBAvailable}
                setInsufficient={handleSetInsufficientB}
                updateBalance={updateBalance}
                setDirection={() => {}}
                tokenType=""
                input={false}
              />
            </div>
            <div className="px-20 mb-2">
              {isCheckingAllowance ? (
                <button className="banner_btn mt-8 hover:bg-symbolHover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg transition ease-in-out p-[8px] bg-secondary-700">
                  <Loading title="Loading..." />
                </button>
              ) : (tokenA.lpSymbol !== "PLS" &&
                  tokenAAllowance !== undefined &&
                  ethers.utils.formatUnits(tokenAAllowance, "ether")) === 0 ? (
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="banner_btn mt-8 hover:bg-symbolHover disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg transition ease-in-out p-[8px] bg-secondary-700"
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
                  className="banner_btn mt-8 hover:bg-symbolHover disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg transition ease-in-out p-[8px] bg-secondary-700"
                >
                  {`Zap ${tokenA.lpSymbol} into ${tokenB.lpSymbol}`}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* TokenA modal */}
        <TokenSelectModal
          open={openA}
          closeModal={closeModalA}
          setToken={handleSetTokenA}
          disabledToken={tokenB?.lpSymbol}
          tokens={tokensList}
        />
        {/* TokenB modal */}
        <TokenSelectModal
          open={openB}
          closeModal={closeModalB}
          setToken={handleSetTokenB}
          disabledToken={tokenA?.lpSymbol}
          tokens={targetTokensList}
        />
      </div>
      {pendingTx && <LogoLoading title="Zapping..." />}
      {isApproving && <LogoLoading title="Approving..." />}
    </>
  );
}
