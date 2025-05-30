import React from "react";
import styled from "styled-components";
import { useFarmUser } from "state/hooks";
import { useTranslation } from "context/Localization";
import { Text } from "uikit";
import { getBalanceNumber } from "utils/formatBalance";
import TokenPairImage, {
  getImageUrlFromToken,
} from "components/TokenPairImage";
import { StyledPrimaryImage } from "uikit/components/Image/styles";
import DepositFee from "./DepositFee";

const Arrow = () => (
  <svg
    className="tokens-arrow"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 8.5L8.5 5V12L12 8.5Z" fill="white" />
    <path d="M4 8.5H11" stroke="white" />
  </svg>
);

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  @media screen and (min-width: 370px) {
    padding-left: 32px;
  }
`;

const TokensWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  color: #fff;

  flex-direction: column;

  @media (max-width: 767px) {
    .tokens-arrow {
      transform: rotate(90deg);
    }
  }

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const TokenWrapper = styled.div`
  width: 30px;
  height: 24px;
  position: relative;
  z-index: 0;

  @media screen and (min-width: 576px) {
    width: 60px;
    height: 40px;
  }
`;

const Farm = ({
  isTokenOnly,
  token,
  quoteToken,
  label,
  pid,
  depositFee,
  hasDiscount,
}) => {
  const { stakedBalance } = useFarmUser(pid);
  const { t } = useTranslation();
  const rawStakedBalance = getBalanceNumber(stakedBalance);

  const handleRenderFarming = () => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px">
          {t("Farming")}
        </Text>
      );
    }

    return null;
  };

  const imgSize = 40;

  return (
    <Container>
      <div className="hidden md:block md:mr-2">
        <TokensWrapper>
          <TokenWrapper>
            {isTokenOnly ? (
              <StyledPrimaryImage
                variant="inverted"
                src={token.logo}
                width={imgSize}
                height={imgSize}
              />
            ) : (
              <TokenPairImage
                variant="inverted"
                primaryToken={token}
                secondaryToken={quoteToken}
                width={imgSize}
                height={imgSize}
              />
            )}
          </TokenWrapper>
          <Arrow />
          <TokenWrapper>
            <StyledPrimaryImage
              variant="inverted"
              src="/assets/tokens/wildx.jpg"
              width={imgSize}
              height={imgSize}
            />
          </TokenWrapper>
        </TokensWrapper>
      </div>
      <div>
        {handleRenderFarming()}
        <Text color="secondary">{label}</Text>
        <p className="text-[12px] w-[99px]">
          <span className="text-gray-400">Deposit fee: </span>
          <DepositFee
            depositFee={depositFee}
            isTokenOnly={isTokenOnly}
            hasDiscount={hasDiscount}
          />
        </p>
      </div>
    </Container>
  );
};

export default Farm;
