import React from "react";
import styled from "styled-components";
import { HelpIcon, Text } from "uikit";
import { useTranslation } from "context/Localization";
import { Tooltip } from "react-tooltip";

const LiquidityWrapper = styled.div`
  font-weight: 600;
  text-align: right;

  @media screen and (min-width: 968px) {
    text-align: left;
    margin-right: 0;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Liquidity = ({ liquidity }) => {
  const displayLiquidity =
    liquidity && liquidity.gt(0)
      ? `$${Number(liquidity).toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}`
      : `$${Number(0).toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}`;
  const { t } = useTranslation();
  // const { targetRef, tooltip, tooltipVisible } = useTooltip(
  //   t('Total value of the funds in this farm’s liquidity pool'),
  //   { placement: 'top-end', tooltipOffset: [20, 10] }
  // )

  return (
    <Container>
      <LiquidityWrapper>
        <Text color="secondary">{displayLiquidity}</Text>
      </LiquidityWrapper>
      {/* <HelpIcon
        data-tooltip-id="liquidity-tooltip"
        data-tooltip-content="Total value of the funds in this farm’s liquidity pool"
      /> */}
      <Tooltip id="liquidity-tooltip" />
      {/* {tooltipVisible && tooltip} */}
    </Container>
  );
};

export default Liquidity;
