import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaExternalLinkAlt, FaRegCopy, FaArrowRight, FaPlus } from "react-icons/fa";

import { getpWiLDAddress, getWethAddress } from "utils/addressHelpers";
import { CHAIN_ID, TESTNET_CHAIN_ID, BASE_SWAP_URL, BASE_URL } from "config";
import { useNetwork } from "wagmi";
import { formatAddress } from "utils/customHelpers";
import { getScanTokenUrl } from "utils/getExplorerURL";
// import { useEthersProvider } from 'hooks/useEthers'

export default function FarmBanner() {
  const [isCopied, setIsCopied] = useState(false);
  const [wildAddress, setWildAddress] = useState("Connect correct wallet");
  const { chain } = useNetwork();
  const token = getpWiLDAddress();
  // const provider = useEthersProvider()

  const addWatchpWiLDToken = useCallback(async () => {
    const provider = window.ethereum;
    if (provider) {
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        await provider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: token,
              symbol: "pWiLD",
              decimals: "18",
              image: `${BASE_URL}/assets/tokens/wildx.jpg`,
            },
          },
        });

        // if (wasAdded) {
        //   console.log('Token was added')
        // }
      } catch (error) {
        console.log("error", error);
        // TODO: find a way to handle when the user rejects transaction or it fails
      }
    }
  }, []);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  useEffect(() => {
    if (chain && (chain.id === CHAIN_ID || chain.id === TESTNET_CHAIN_ID)) {
      const addr = getpWiLDAddress();
      setWildAddress(addr);
    }
  }, [chain]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex-y justify-center">
        <div className="px-3 py-10 text-center md:text-left">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="bg-gradient-to-r from-[#e879f9] via-[#f59e0b] to-[#8b5cf6] bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent text-5xl mb-10">EARN EMBER</h1>
          </motion.h1>
          <motion.span
            className="text-lg text-white/80 mb-6 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="">
              Stake your tokens to earn EMBER as we build a new ecosystem of<br />
              yield opportunities. All EMBER sales taxes are burned to reduce<br />
              inflation, and there are no non-native coins for whales to dump.<br />
            </span>
          </motion.span>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex-y justify-center">
            <div className="flex items-center justify-start px-3 gap-3">
              <a
                className="banner_btn flex justify-center items-center gap-2 px-4"
                href={`${BASE_SWAP_URL}?inputCurrency=${getWethAddress()}&outputCurrency=${getpWiLDAddress()}`}
                target="_blank"
              >
                Buy EMBER
                <FaArrowRight className="text-sm"/>
              </a>
              <button
                onClick={addWatchpWiLDToken}
                className=" banner_add_btn flex justify-center items-center gap-2 px-4"
              >
                Add EMBER to wallet
                <FaPlus className="text-sm"/>
              </button>
            </div>
            <div className="flex justify-start">
              <div className="flex items-center justify-center">
                <a
                  className="w-100 px-3 flex items-center justify-center py-10 text-base hover:underline text-sm"
                  href={`${
                    chain && chain.id === CHAIN_ID
                      ? getScanTokenUrl(wildAddress)
                      : ""
                  }`}
                  target="_blank"
                >
                  <span className="hidden xl:block">
                    {formatAddress(wildAddress, 10)}
                  </span>
                  <span className="block xl:hidden">
                    {formatAddress(wildAddress, 6)}
                  </span>
                </a>
                  <CopyToClipboard text={wildAddress} onCopy={handleCopy}>
                    <span className="flex items-center cursor-pointer">
                      <FaRegCopy color="gray" />
                    </span>
                  </CopyToClipboard>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
