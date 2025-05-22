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
          <div className="min-w-[60px] text-right text-symbol lg:mr-4 mr-2">{value}%</div>
          {/* {!hideButton && (
            <ApyButton
              lpLabel={lpLabel}
              wildPrice={wildPrice}
              apr={originalValue}
              addLiquidityUrl={addLiquidityUrl}
            />
          )} */}
        </>
      ) : (
        <div className="min-w-[60px] text-left text-symbol lg:mr-4 mr-2">0%</div>
      )}
      <HelpIcon
        data-tooltip-id="liquidity-tooltip"
        data-tooltip-content="The Multiplier represents the 
                  proportion of pWiLD rewards each farm receives"
      />
    </Container>
  ) : (
    <Container>
      <div className="min-w-[60px] text-right text-symbol lg:mr-4 mr-2">{originalValue}%</div>
    </Container>
  );
};

export default Apr;
