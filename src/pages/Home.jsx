import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {motion} from "framer-motion";
import BigNumber from "bignumber.js";
import FarmBanner from "components/FarmsComponents/Banner";
import FarmStaking from "components/FarmsComponents/StakingInfo";
import TotalValueLocked from "components/FarmsComponents/TotalValueLocked";
import FarmControls from "components/FarmsComponents/Controls";
import FarmTables from "components/FarmsComponents/Tables";
import { getSortOptions, DesktopColumnSchema } from "constants";
import { useLocation } from "react-router-dom";
import { orderBy } from "lodash";
import { latinise } from "utils/latinise";
import { getFarmApr } from "utils/getApr";
import { getBalanceNumber } from "utils/formatBalance";
import isArchivedPid from "utils/farmHelpers";
import { usePWiLDPerSecond } from "hooks/useTokenBalance";
import { NUMBER_OF_FARMS_VISIBLE } from "config";
import { useFarms, usePollFarmsData, usePricepWiLDUsdc } from "state/hooks";
import { useAccount } from "wagmi";
import Swap from "./Swap";
import Zapper from "./zapper";
import Farms from "./Farms";

export default function Home() {
  return (
    <div className="justify-center w-full px-auto md:px-48 mt-16">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
        <div className="hidden md:block absolute -top-[35%] left-[55%]  w-full md:w-1/3 h-full opacity-15 -z-20 duration-300">
          <svg 
            viewBox="0 0 400 400" 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-full w-full"
          >
            <g opacity="0.8">
              <circle cx="200" cy="200" r="150" stroke="#b280ff" strokeWidth="1" fill="none" />
              <circle cx="200" cy="200" r="120" stroke="#8a3ffc" strokeWidth="1" fill="none" />
              <circle cx="200" cy="200" r="90" stroke="#ff6b2b" strokeWidth="1" fill="none" />
              
              <path 
                d="M200,50 L200,350 M50,200 L350,200" 
                stroke="#8a3ffc" 
                strokeWidth="0.5" 
                opacity="0.3"
              />
              
              <g className="rotate">
                <circle cx="200" cy="80" r="4" fill="#ff6b2b" />
                <circle cx="320" cy="200" r="4" fill="#8a3ffc" />
                <circle cx="200" cy="320" r="4" fill="#ff6b2b" />
                <circle cx="80" cy="200" r="4" fill="#8a3ffc" />
              </g>
            </g>
          </svg>
        </div>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-20 items-center mb-20">
        <FarmBanner />
        <div className="md:ml-20 md:pl-20">
        <TotalValueLocked />
        </div>
      </div>
      <Farms home={false}/>
      <div className="flex justify-center mt-28">
      <Zapper home={false}/>
      </div>
    </div>
  );
}
