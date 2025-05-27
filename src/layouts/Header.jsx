import React, { useState } from "react";
import { Fade as Hamburger } from "hamburger-react";
import { routes } from "config";
import { WalletConnect } from "components/UI/ConnectButton";

export default function Header() {
  const currentUrl = window.location.pathname;
  const [isMobile, setMobile] = useState(false);

  return (
    <>
      <div className="glass sticky top-0 z-50 border-b-3 border-[#4c1d95] shadow-md">
        <div className="container mx-auto px-4 py-1 md:py-3 items-center relative">
          <div className="flex justify-between">
            <div className="hidden sm:block flex items-center">
              <a href="/" className="flex items-center">
                <svg
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  className="Phone is-animating ember-pulse"
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
                <div className="flex gap-2 items-center">
                  <h1 className="flex text-xl mx-3 font-bold bg-gradient-to-r from-[#946cc5] via-[#f59e0b] to-[#8b5cf6] bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent">
                  EMBER <span className="flex mx-1 text-sm font-normal text-white/70 flex items-end">Finance</span>
                </h1>
                </div>
                
            </a>
            </div>
            <div
              className="text-symbol ml-2 block sm:hidden mt-[3px]"
              onClick={() => setMobile(!isMobile)}
            >
              <Hamburger />
            </div>

            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <ul className="nav_list">
                {routes.map((link, key) => (
                  <li
                    className={`list_item ${
                      currentUrl === link.url ? "active" : ""
                    }`}
                    key={key}
                  >
                    <a href={link.url}>{link.name}</a>
                    <div className="flex gap-[2px]">
                      <div className="h-1 w-full bg-symbol"></div>
                    </div>
                  </li>
                ))}
                {/* <li className="list_item">
                  <a
                    href="https://lodgedocs.gitbook.io/pwild-pulsechain-farm/"
                    target="_blank"
                    className={`p-3`}
                    rel="noopener noreferrer"
                  >
                    Docs
                  </a>
                  <div className="flex gap-[2px]">
                    <div className="h-1 w-full bg-symbol"></div>
                    <div className="w-1 h-1 bg-symbol rounded-full"></div>
                  </div>
                </li> */}
              </ul>
            </div>

            <div className="nav_action">
              <WalletConnect />
              <div
                className="text-symbol ml-2 hidden sm:block lg:hidden"
                onClick={() => setMobile(!isMobile)}
              >
                <Hamburger />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMobile === true ? (
        <div className="container mr-auto ml-auto">
          <div className="nav_bar mobile_navbar">
            <ul className="nav_list">
              {routes.map((link, key) => (
                <li
                  className={`list_item ${
                    currentUrl === link.url ? "active" : ""
                  }`}
                  key={key}
                >
                  <a href={link.url}>{link.name}</a>
                </li>
              ))}
              {/* <li className={`list_item`}>
                <a
                  href="https://lodgedocs.gitbook.io/pwild-pulsechain-farm/"
                  target="_blank"
                  className={`p-3`}
                  rel="noopener noreferrer"
                >
                  {" "}
                  Docs
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
