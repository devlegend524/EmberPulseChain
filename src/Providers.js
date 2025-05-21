import React from "react";
import { ToastContainer } from "react-toastify";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { pulsechain } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { RefreshContextProvider } from "context/RefreshContext";
import ContractContextProvideer from "context/contracts";
import { ThemeContextProvider } from "context/ThemeContext";
import { LanguageProvider } from "context/Localization";
import { ModalProvider } from "uikit";

import { ALCHEMY_ID } from "config";
import store from "state";

const Providers = ({ children }) => {
  const { chains, publicClient } = configureChains(
    [pulsechain],
    [alchemyProvider({ apiKey: ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "wildbase.fram",
    projectId: "85ea32d265dfc865d0672c8b6b5c53d2",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <Provider store={store}>
          <HelmetProvider>
            <ThemeContextProvider>
              <LanguageProvider>
                <RefreshContextProvider>
                  <ContractContextProvideer>
                    <ModalProvider>{children}</ModalProvider>
                  </ContractContextProvideer>
                </RefreshContextProvider>
              </LanguageProvider>
            </ThemeContextProvider>
          </HelmetProvider>
          <ToastContainer />
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
