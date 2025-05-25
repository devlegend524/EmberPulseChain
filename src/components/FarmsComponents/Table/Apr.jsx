/* eslint-disable react/no-unused-prop-types */

import React from "react";
import styled from "styled-components";
import ApyButton from "./ApyButton";
import { HelpIcon, Skeleton } from "uikit";
import { BASE_ADD_LIQUIDITY_URL } from "config";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";

const Container = styled.div`
  display: flex;
  align-items: center;

  button {
    width: 20px;
    svg {
      path {
        fill: #0d0d0d;
      }
    }
  }
`;

const Apr = ({
  active={},
  value,
  lpLabel,
  tokenAddress,
  quoteTokenAddress,
  wildPrice,
  originalValue,
  hideButton = false,
}) => {
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress,
    tokenAddress,
  });
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`;

  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <>
          <div className={`min-w-[60px] ${active ? "text-green-500": "text-left"}t text-white lg:mr-4 mr-2`}>
            {value}%
          </div>
          {/* {!hideButton && (
            <ApyButton
              lpLabel={lpLabel}
              wildPrice={wildPrice}
              apr={originalValue}
              addLiquidityUrl={addLiquidityUrl}
            />
          )} */}
          <HelpIcon
            data-tooltip-id="liquidity-tooltip"
            data-tooltip-content="The Multiplier represents the 
                  proportion of EMBER rewards each farm receives"
            className="text-gray-400"
          />
        </>
      ) : (
        <div className="min-w-[60px] text-left text-white lg:mr-4 mr-2">0%</div>
      )}
    </Container>
  ) : (
    <Container>
      <div className="min-w-[60px] text-left text-white lg:mr-4 mr-2">
        {originalValue}%
      </div>
    </Container>
  );
};

export default Apr;
