import React, { useState, useEffect } from "react";
import { useEthersProvider } from "hooks/useEthers";
import { useAccount } from "wagmi";
import { getBalance } from "utils/balanceHalper";
import { toFixed } from "utils/customHelpers";
import { useDebounce } from "use-debounce";

export default function ZapTokenSelect({
  setOpen,
  token,
  setAmount,
  selectOnly,
  setStates,
  amount,
  setInsufficient,
  insufficient,
  updateBalance,
  setDirection,
  tokenType,
  input,
}) {
  const provider = useEthersProvider();
  const { address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [localAmount, setLocalAmount] = useState("");
  const [fromParent, setFromParent] = useState(false);
  const [debouncedValue] = useDebounce(localAmount, 1000);

  const handleMaxAmount = () => {
    const maxValue =
      balance > 0 ? Number((Number(balance) - Number(0.00001)).toFixed(5)) : 0;
    setAmount(maxValue);
    setLocalAmount(Number(maxValue));
    setInsufficient(false);
  };

  const checkAvailable = (value) => {
    if (Number(value) <= balance) {
      setStates(true);
      setInsufficient(false);
    } else {
      setStates(false);
      setInsufficient(true);
    }
  };

  const fetchBalance = async (token) => {
    const balance = await getBalance(address, token, provider);
    setBalance(balance);
    setStates(Number(balance) > 0);
    setLoading(false);
  };

  const handleChangeValue = (e) => {
    setLocalAmount(e.target.value);
    setFromParent(false);
  };

  useEffect(() => {
    if (!selectOnly && !loading) {
      checkAvailable(localAmount);
    }
  }, [loading, token]);

  useEffect(() => {
    setLoading(true);
    fetchBalance(token);
  }, [token, updateBalance]);

  useEffect(() => {
    if (amount !== localAmount) {
      setLocalAmount(amount);
      setFromParent(true);
    }
  }, [amount]);

  useEffect(() => {
    if (localAmount) {
      setInsufficient(Number(balance) <= Number(localAmount));
    } else {
      setInsufficient(false);
    }
  }, [balance]);

  useEffect(() => {
    if (Number(debouncedValue) > 0 && !fromParent) {
      setDirection(tokenType);
      setAmount(debouncedValue);
      checkAvailable(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <>
      <div className="glass flex-y bg-primary/60 px-6 py-7 space-y-4 border border-[#18181b] rounded-3xl relative">
      <div className="text-lg">
        {input?"Input ":"Output "}Token
      </div>
        <div className="flex items-center justify-between gap-5">
          <div
            onClick={() => {
              setOpen(true);
            }}
            className="flex items-center gap-1 hover:bg-primary transition ease-in-out rounded-full cursor-pointer p-2 bg-secondary"
          >
            {token.isTokenOnly ? (
              <img
                className="md:w-8 md:h-8 w-8 h-8 rounded-full"
                src={token?.logoA}
                alt=""
              />
            ) : (
              <div className="md:w-8 md:h-8 w-8 h-8 relative ml-2">
                <img
                  className="md:w-8 md:h-8 w-8 h-8 rounded-full absolute left-1/2 -translate-x-[80%]"
                  src={token?.logoA}
                  alt=""
                />{" "}
                <img
                  className="md:w-8 md:h-8 w-8 h-8 rounded-full  absolute left-1/2 -translate-x-[30%]"
                  src={token?.logoB}
                  alt=""
                />
              </div>
            )}
            <span className="text-sm text-gray-200 md:w-28 hidden md:block text-center">
              {token?.lpSymbol}
            </span>
            <img className="rounded-full" src="/assets/arrow-down.png" alt="" />
          </div>
          <div className="flex-y justify-end">
            {loading ? (
              <div className="bg-secondary rounded h-[12px] w-[60px] animate-pulse"></div>
            ) : (
              <div
              onClick={handleMaxAmount}
              className="text-sm text-gray-400 text-end cursor-pointer"
              >
                {`Balance: ${balance ? toFixed(balance, 5) : "0.0"}`}
              </div>
            )}
            {!selectOnly && (
              <div className="p-1">
              <div
                onClick={handleMaxAmount}
                className="bg-[#321d4d] text-symbol cursor-pointer shadow-xl text-sm text-center hover:bg-[#422468] rounded-full duration-300 transition ease-in-out"
              >
                MAX
              </div>
              </div>
            )}
          </div>
        </div>
        <div className="token_prices flex justify-between p-2 pl-2 items-end relative w-full border border-[#27272a] rounded-xl">
          <input
            type="number"
            className="text-xl text-gray-200 text-end flex items-center bg-red"
            placeholder="0.0"
            min={0}
            value={localAmount}
            onChange={handleChangeValue}
          />
        </div>
            {insufficient && (
              <p className="absolute bottom-2 right-6 text-[12px] text-red-500">
                Insufficient Balance
              </p>
            )}
      </div>
    </>
  );
}
