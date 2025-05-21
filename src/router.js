import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Home = lazy(() => import("pages/Home"));
const Swap = lazy(() => import("pages/Swap"));
const Doc = lazy(() => import("pages/doc"));
const Liquidity = lazy(() => import("pages/Liquidity"));
const NotFound = lazy(() => import("pages/Notfound"));
const Farms = lazy(() => import("pages/Farms"));
const NFT = lazy(() => import("pages/NftClaim"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/farms",
    element: <Farms />,
  },
  {
    path: "/swap",
    element: <Swap />,
  },
  {
    path: "/liquidity",
    element: <Liquidity />,
  },
  {
    path: "/doc",
    element: <Doc />,
  },
  // {
  //   path: "/nft-claim",
  //   element: <NFT />,
  // },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
