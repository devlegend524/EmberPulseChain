import React from "react";
import { motion } from "framer-motion";

export default function FarmControls({
  options,
  onChange,
  checked,
  onToggleChange,
  query,
  onSearchChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
        <div className="md:flex-row lg:flex items-center justify-start lg:justify-between px-2 py-4 mt-5 rounded-xl">
          <div className="">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
              Farms & Staking
            </p>
            <p className="pb-2 text-gray-400">Stake your tokens to earn EMBER rewards</p>
          </div>
          <div className="flex justify-end items-center gap-2 md:gap-5 w-full md:w-fit">
            <div>
              <label className="relative inline-flex items-center cursor-pointer ">
              <input
                type="checkbox"
                value={checked}
                onChange={() => onToggleChange()}
                className="sr-only peer"
              />
              <div className="w-11 h-6 button_bg  bg-[#16171e!important] rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:bg-symbol dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-gray-400 after:content-[''] after:absolute after:top-2 md:after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 md:after:h-5 after:w-3.5 md:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-symbol"></div>
              <span className="ml-3 text-xs md:text-md font-medium">Staked Only</span>
            </label>
            </div>
            <div>
              <select
                id="countries"
                className="button_bg border border-[#18181b] text-sm rounded-md p-2 bg-transparent outline-0"
                onChange={(e) => onChange(e.target.value)}
              >
                {options.map((item, index) => (
                  <option value={item.value} key={index}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full md:w-fit">
              <input
                value={query}
                className="button_bg p-2 border border-[#18181b] rounded-md w-full md:w-fit bg-transparent outline-0"
                placeholder="Search Farms"
                onChange={(e) => onSearchChange(e)}
              />
            </div>
          </div>
        </div>
    </motion.div>
  );
}
