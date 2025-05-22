import React, { useMemo, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "context/Localization";
import { LinkExternal, Text } from "uikit";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import { getScanAddressUrl } from "utils/getExplorerURL";
import {
  DepositLockDicountTag,
  NoFeesTag,
  SingleStakeTag,
  NFTStakeTag,
} from "components/Tags";
import { BASE_ADD_LIQUIDITY_URL, BASE_SWAP_URL } from "config";

import HarvestAction from "./HarvestAction";
import StakedAction from "./StakedAction";
import Apr from "../Apr";
import Multiplier from "../Multiplier";
import Liquidity from "../Liquidity";

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;

  @media screen and (min-width: 576px) {
    margin-top: 16px;
  }
  @media screen and (max-width: 576px) {
    flex-direction: column;
    margin-top: 0;
    gap: 0.5rem;
  }
  > div {
    height: 24px;
    padding: 2px 6px;
    font-size: 14px;
    margin-right: 4px;
    border-radius: 5px;

    svg {
      width: 14px;
    }
  }
`;
const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`;

const ActionPanel = ({
  details,
  apr,
  multiplier,
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
    <div className="action_panel_container ">
      <div className="flex-y">
        <HarvestAction {...farm} userDataReady={userDataReady} />
        <div className="flex flex-col justify-between w-full px-4 py-2 bg-[#050506] border border-[#292524] rounded-xl">
          <ValueWrapper>
            <Text color="textWhite">{t("APR")}</Text>
            <Apr {...apr} />
          </ValueWrapper>
          <ValueWrapper>
            <Text color="textWhite">{t("Multiplier")}</Text>
            <Multiplier {...multiplier} />
          </ValueWrapper>
          <ValueWrapper>
            <Text color="textWhite">{t("Liquidity")}</Text>
            <Liquidity {...liquidity} />
          </ValueWrapper>
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
