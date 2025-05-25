/* eslint-disable react/destructuring-assignment */

import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useMatchBreakpoints } from "uikit";
import { useTranslation } from "context/Localization";
import useDelayedUnmount from "hooks/useDelayedUnmount";
import { useFarmUser } from "state/hooks";

import Apr from "./Apr";
import Farm from "./Farm";
import Earned from "./Earned";
import Details from "./Details";
import Multiplier from "./Multiplier";
import Liquidity from "./Liquidity";
import ActionPanel from "./Actions/ActionPanel";
import CellLayout from "./CellLayout";
import { DesktopColumnSchema, MobileColumnSchema } from "constants";

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  liquidity: Liquidity,
};

const Content = styled.div`
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: transparent;
  
  ${props => props.expanded && css`
    max-height: 2000px;
  `}
`;

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  @media screen and (min-width: 1080px) {
    padding-right: 32px;
  }
`;

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`;

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`;

const FarmMobileCell = styled.td`
  padding-top: 24px;
`;

const Row = (props) => {
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const { details, userDataReady } = props;
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber();
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount);
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300);
  const { t } = useTranslation();

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded);
  };

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount);
  }, [hasStakedAmount]);

  useEffect(() => {
    if (actionPanelExpanded && cardRef.current) {
      const cardBottom = cardRef.current.getBoundingClientRect().bottom;
      const viewportHeight = window.innerHeight;
      const currentScrollY = window.scrollY;
      
      if (cardBottom > viewportHeight) {
        const scrollDelta = cardBottom - viewportHeight + 18;
        const potentialNewScrollY = currentScrollY + scrollDelta;
        
        if (potentialNewScrollY > currentScrollY) {
          window.scrollTo({
            top: potentialNewScrollY,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [actionPanelExpanded]);

  const { isXl, isXs } = useMatchBreakpoints();
  const isMobile = !isXl;
  const tableSchema = isMobile ? MobileColumnSchema : DesktopColumnSchema;
  const columnNames = tableSchema.map((column) => column.name);

  const handleRenderRow = () => {
    if (!isXs) {
      return (
        <div ref={cardRef} className="m-3 px-6 border border-[#18181b] rounded-xl shadow-xl">
          <div className='flex justify-around border-b border-[#27272a]' onClick={toggleActionPanel} >
            {Object.keys(props).map((key) => {
              const columnIndex = columnNames.indexOf(key);
              if (columnIndex === -1) {
                return null;
              }

              switch (key) {
                case "details":
                  return (
                    <td key={key}>
                      <CellInner>
                        <CellLayout>
                          <Details actionPanelToggled={actionPanelExpanded} />
                        </CellLayout>
                      </CellInner>
                    </td>
                  );
                case "apr":
                  return (
                    <td key={key}>
                      <CellInner>
                        <CellLayout label={t("APR")}>
                          <Apr {...props.apr} hideButton={isMobile} />
                        </CellLayout>
                      </CellInner>
                    </td>
                  );
                default:
                  return (
                    <td key={key}>
                      <CellInner>
                        <CellLayout label={t(tableSchema[columnIndex].label)}>
                          {React.createElement(cells[key], {
                            ...props[key],
                            userDataReady,
                          })}
                        </CellLayout>
                      </CellInner>
                    </td>
                  );
              }
            })}
          </div>
          <Content 
            ref={contentRef}
            expanded={actionPanelExpanded}
            aria-hidden={!actionPanelExpanded}
          >
              <ActionPanel {...props} hasDiscount={props.farm.hasDiscount}/>
          </Content>
        </div>
      );
    }
    return (
      <tr className="tr" onClick={toggleActionPanel}>
        <td>
          <div>
            <AprMobileCell>
              <CellLayout label={t("APR")}>
                <Apr {...props.apr} hideButton />
              </CellLayout>
            </AprMobileCell>
            <EarnedMobileCell>
              <CellLayout label={t("Earned")}>
                <Earned {...props.earned} userDataReady={userDataReady} />
              </CellLayout>
            </EarnedMobileCell>
          </div>
          <div>
            <FarmMobileCell>
              <CellLayout>
                <Farm {...props.farm} />
              </CellLayout>
            </FarmMobileCell>
          </div>
        </td>
        <td>
          <CellInner>
            <CellLayout>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellLayout>
          </CellInner>
        </td>
      </tr>
    );
  };

  return (
    <>
      {handleRenderRow()}
    </>
  );
};

export default Row;