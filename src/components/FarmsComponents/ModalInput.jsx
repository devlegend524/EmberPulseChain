import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "components/Loading";
import { Text, Button, Input, Link } from "uikit";
import { useTranslation } from "context/Localization";
import { BigNumber } from "bignumber.js";
import { useEthersSigner } from "hooks/useEthers";
import { useAccount } from "wagmi";
import { getMasterchefContract, getNFTContract } from "utils/contractHelpers";
const getBoxShadow = ({ theme }) => {
  return theme.shadows.inset;
};

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`;

const ModalInput = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
  isNFTPool,
  decimals = 18,
  tokenInfo,
}) => {
  const [userBalance, setUserBalance] = useState("");
  const { address } = useAccount();
  const signer = useEthersSigner();
  const { t } = useTranslation();
  const isBalanceZero = max === "0" || !max;

  function removeLeadingZeros(arr) {
    let i = 0;
    while (Number(arr[i]) === 0) {
      i++;
    }
    return arr.slice(i);
  }

  const displayBalance = async (balance) => {
    const nftContract = getNFTContract(signer);
    const masterChefContract = getMasterchefContract(signer);

    if (isBalanceZero) {
      setUserBalance("0");
    }
    if (isNFTPool) {
      let tokenIds;
      if (inputTitle === "Stake") {
        tokenIds = await nftContract.walletOfOwner(address);
      } else {
        tokenIds = await masterChefContract.getUserStakedNFTs(6, address);
      }
      setUserBalance(balance);
      // setUserBalance(
      //   balance + " : [ " + removeLeadingZeros(tokenIds).toString() + " ]"
      // );
    } else {
      const balanceBigNumber = new BigNumber(balance);
      if (balanceBigNumber.gt(0) && balanceBigNumber.lt(0.0001)) {
        setUserBalance(balanceBigNumber.toLocaleString());
      }
      setUserBalance(balanceBigNumber.toFixed(4, BigNumber.ROUND_DOWN));
    }
  };
  useEffect(() => {
    if (address && signer) displayBalance(max);
  }, [address, signer, max]);

  return (
    <div className="relative">
      <div className="flex items-center justify-center flex-col">
        <div className="w-full mb-2 border-b border-[#27272a]">
          <div className="flex justify-center w-full">
          <img
            src={tokenInfo?.logo}
            alt="token"
            className="rounded-full w-[60px] h-[60px] lg:w-[65px] lg:h-[65px] border-[2px] border-white mb-3"
          />
        </div>
       
        </div>
        <div className="flex flex-row justify-between items-center pb-1 w-full text-gray-400">
          <span ><span className="font-bold text-lg">{tokenInfo?.symbol}</span> Token</span> 
          <div className="">
            Available: <span className="text-white"> {userBalance}</span>
            {/* {userBalance ? (
              <Loading title="..." />
            ) : (
              Number(userBalance.toString()).toFixed(4)
            )}{" "} */}
          </div>
          
        </div>
        <div className="flex justify-between items-center gap-2 w-full py-3 px-2">
          <input
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            max="1"
            type="text"
            onChange={(e) => onChange(e)}
            placeholder={isNFTPool ? "amount of NFT(s)" : "0.00"}
            className="bg-transparent w-full p-2 focus-visible:outline-none text-right px-2 border border-gray-500 rounded-md"
            value={value}
          />
          <div className="flex items-center justify-center">
            <button
              className="text-gray-400 hover:text-gray-200 px-2 py-1 bg-secondary-600 cursor-pointer glass rounded-lg hover:scale-105 transition ease-in-out"
              onClick={onSelectMax}
            >
              MAX
            </button>
          </div>
        </div>
      </div>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure">
          {t("No tokens to stake")}:{" "}
          <Link fontSize="12px" href={addLiquidityUrl} external color="failure">
            {t("Get %symbol%", { symbol })}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  );
};

export default ModalInput;
