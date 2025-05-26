import React, { useMemo, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "context/Localization";
import { LinkExternal, Text } from "uikit";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import { getScanAddressUrl } from "utils/getExplorerURL";

import { BASE_ADD_LIQUIDITY_URL, BASE_SWAP_URL } from "config";

import HarvestAction from "./HarvestAction";
import StakedAction from "./StakedAction";
import Apr from "../Apr";
import Earned from "../Earned";
import DepositFee from "../DepositFee";
import Liquidity from "../Liquidity";

const ActionPanel = ({
  details,
  apr,
  earned,
  liquidity,
  userDataReady,
}) => {
  const [farm, setFarm] = useState(details);

  const { t } = useTranslation();
  const tokenOnly = farm.isTokenOnly;
  const nftOnly = farm.isNFTPool;
  const isActive = farm.multiplier !== "0X";
  const { quoteToken, token } = farm;
  const lpLabel =
    farm.lpSymbol && farm.lpSymbol.toUpperCase().replace("PANARB", "");
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  });
  const lpAddress = farm.lpAddresses;
  const scan = useMemo(
    () => getScanAddressUrl(tokenOnly ? farm.token.address : lpAddress),
    [tokenOnly, lpAddress, farm.token.address]
  );
  const noFees = parseFloat(farm.depositFee) === 0;
  const link = useMemo(
    () =>
      tokenOnly
        ? `${BASE_SWAP_URL}?outputCurrency=${farm.token.address}`
        : `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`,
    [tokenOnly, liquidityUrlPathParts, farm.token.address]
  );

  useEffect(() => {
    setFarm(details);
  }, [details]);
  return (
    <div className="md:flex-row grid md:grid-cols-1 lg:grid-cols-2 justify-center items-start gap-4 py-2 lg:py-3 w-full">
      <div className="">
        <HarvestAction {...farm} userDataReady={userDataReady} />
        <div className="flex flex-col justify-between space-y-2 w-full px-4 py-4 bg-[#070708] border border-[#18181b] rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">{t("APR")}</span>
            <Apr {...apr}/>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">{t("Earn")}</span>
            <span className="text-white text-md">{earned.earnings}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">{t("Deposit Fee")}</span>
            <span className="text-white text-md">{farm.depositFee}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">{t("Liquidity")}</span>
            <Liquidity {...liquidity} />
          </div>
        </div>
      </div>
      <StakedAction
        {...farm}
        isActive={isActive}
        link={link}
        lpLabel={lpLabel}
        scan={scan}
        userDataReady={userDataReady}
      />
    </div>
  );
};

export default ActionPanel;
