import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaAngleDown } from "react-icons/fa";
import { usePricepWiLDUsdc } from "state/hooks";
export const WalletConnect = () => {
  const priceData = usePricepWiLDUsdc();
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="main_btn px-5 sm:m-0 transition ease-in-out"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="m-2 sm:m-0 hover:bg-red-500 bg-red-600  transition ease-in-out text-[white!important] flex justify-center items-center gap-1 py-2 px-4 rounded-full"
                  >
                    Wrong network
                    <FaAngleDown className="text-xl" />
                  </button>
                );
              }
              return (
                <div className="flex items-center">
                  <svg
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  className="Phone is-animating"
                >
                  <defs>
                    <radialGradient id="emberGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#ffad42" />
                      <stop offset="100%" stopColor="#ff5e0e" />
                    </radialGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <circle cx="50" cy="50" r="45" fill="#1a0d2a" />
                  
                  {/* Stylized E shape with flame elements */}
                  <path 
                    d="M30,25 C40,35 45,40 35,55 C45,60 48,70 40,75 C70,75 75,40 50,35 C60,30 55,25 45,25 Z" 
                    fill="url(#emberGradient)"
                    filter="url(#glow)"
                  />
                  
                  {/* Purple accent elements */}
                  <path 
                    d="M40,35 C55,38 65,45 55,60 C65,55 70,40 55,35 Z" 
                    fill="#8a3ffc"
                    opacity="0.7"
                  />
                </svg>
                  <p className="hidden sm:flex items-center text-symbol">
                    {Number(priceData[0]) ? `~ ${priceData[0].toString()}` : ""}
                  </p>
                  <button
                    onClick={openChainModal}
                    className="hidden sm:inline-flex justify-center items-center rounded-full  transition ease-in-out text-black text-xl"
                  >
                    {chain.iconUrl ? (
                      <img
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        className="h-[30px!important] w-[30px!important]"
                      />
                    ) : (
                      <img
                        alt={chain.name ?? "Chain icon"}
                        src="/chain.svg"
                        className="h-[30px!important] w-[30px!important]"
                      />
                    )}
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="m-2 sm:m-0 hover:bg-symbolHover main_btn px-5 py-1transition ease-in-out flex justify-center items-center gap-1"
                    type="button"
                  >
                    {account.displayName}
                    <FaAngleDown className="text-xl" />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
