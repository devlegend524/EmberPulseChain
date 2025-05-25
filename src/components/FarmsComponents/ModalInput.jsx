import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
      setUserBalance(balanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN));
    }
  };

  useEffect(() => {
    if (address && signer) displayBalance(max);
  }, [address, signer, max]);

  return (
    <div className="relative">
      <div className="flex items-center flex-col">
        <div className="flex justify-center w-full mb-6 border-b border-gray-400 py-2">
          <Text fontSize="25px" color="textWhite">
            {inputTitle}
          </Text>
        </div>
        <div className="flex flex-row justify-between items-center pb-3 w-full">
          <div>
            <Text fontSize="16px" color="textWhite">
              {symbol}
            </Text>
          </div>
          <div>
            <Text fontSize="15px" color="textWhite">
              {t("Balance: %balance%", { balance: userBalance })}
            </Text>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-full gap-3 py-3">
          <input
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            max="1"
            type="text"
            onChange={(e) => onChange(e)}
            placeholder={isNFTPool ? "amount of NFT(s)" : "0.00"}
            className="bg-transparent p-2 focus-visible:outline-none w-80px text-right px-2 border border-gray-500 rounded-md"
            value={value}
          />
          <Button
            scale="sm"
            onClick={onSelectMax}
            className="pulse_bg text-[white!important]"
          >
            {t("Max")}
          </Button>
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
