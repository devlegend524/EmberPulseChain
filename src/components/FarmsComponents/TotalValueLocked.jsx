import React from "react";
import { motion } from "framer-motion";
import { useTotalSupply } from "hooks/useTokenBalance";
import { usePricepWiLDUsdc, useTotalValue } from "state/hooks";
import CardValue from "./Staking/CardValue";
import { convertCurrency, toReadableAmount } from "utils/customHelpers";
import { useContractRead, erc20ABI } from "wagmi";
import { getpWiLDAddress, getWethAddress } from "utils/addressHelpers";
import wildABI from "config/abis/wild.json";

export default function TotalValueLocked() {
  const tvlData = useTotalValue();
  const tvl = tvlData
    ? tvlData.toLocaleString("en-US", { maximumFractionDigits: 1 })
    : 0;
  const liquidity = usePricepWiLDUsdc()[1];
  const marketCap = usePricepWiLDUsdc()[2];

  const totalSupply = useTotalSupply();
  // 0xeAA13b4f85A98E6CcaF65606361BD590e98DE2Cb
  const tokenABalanceRead = useContractRead({
    address: getpWiLDAddress(),
    abi: wildABI,
    functionName: "balanceOf",
    args: ["0x000000000000000000000000000000000000dead"],
    chainId: 359,
  });
  const pWildBalanceRead = useContractRead({
    address: getpWiLDAddress(),
    abi: wildABI,
    functionName: "balanceOf",
    args: ["0xeAA13b4f85A98E6CcaF65606361BD590e98DE2Cb"],
    chainId: 359,
  });
  const wethBalanceRead = useContractRead({
    address: getWethAddress(),
    abi: erc20ABI,
    functionName: "balanceOf",
    args: ["0xeAA13b4f85A98E6CcaF65606361BD590e98DE2Cb"],
    chainId: 359,
  });

  const totalMinted =
    totalSupply - toReadableAmount(tokenABalanceRead?.data, 18);
  return (
    <motion.div
      className="rounded-3xl px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2}}
    >
      <div className="glass p-8 rounded-3xl w-full stat-card relative overflow-hidden">
        <div className="relative">
          <h2 className="text-xl font-semibold mb-8">EMBER Stats</h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Current Sales Tax</span>
                <span className="font-medium text-white">3.00%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-[#a855f7] via-[#ea580c] to-[#86198f] bg-[length:200%_200%] animate-gradient h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="glass p-4 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-xs text-white/60 mb-1">TVL</h3>
                <p className="text-lg font-bold">
                  {tvlData !== null ? (
                    <div color="#fff" className="text-xl font-bold">
                      {`$${tvl}`}
                    </div>
                  ) : (
                    <div />
                  )}
                </p>
                <span className="text-xs text-success flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  +5.3%
                </span>
              </motion.div>

              <motion.div
                className="glass p-4 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-xs text-white/60 mb-1">Market Cap</h3>
                <p className="text-lg font-bold">
                  {toReadableAmount(tokenABalanceRead?.data, 18) && (
                    <CardValue
                      fontSize="20px"
                      decimals={1}
                      value={Number(
                        toReadableAmount(tokenABalanceRead?.data, 18)
                      )}
                      color="#fffff"
                    />
                  )}
                </p>
                <span className="text-xs text-success flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  +2.8%
                </span>
              </motion.div>
            </div>

            <motion.div
              className="glass p-4 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs text-white/60">Circulating Supply</h3>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {toReadableAmount(tokenABalanceRead?.data, 18) && (
                    <CardValue
                      fontSize="20px"
                      decimals={1}
                      value={Number(
                        toReadableAmount(tokenABalanceRead?.data, 18)
                      )}
                      color="#fffff"
                    />
                  )}{" "}
                  Burned
                </span>
              </div>
              <p className="flex items-center gap-2 text-lg font-bold">
                {totalSupply && (
                  <CardValue
                    fontSize="20px"
                    value={totalMinted}
                    decimals={1}
                    color="#fffff"
                  />
                )}{" "}
                EMBER
              </p>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                <motion.div
                  className="bg-symbol h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "34%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
