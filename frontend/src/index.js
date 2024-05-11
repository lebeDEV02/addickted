import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/header/Header";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Body from "./components/body/Body";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("react-target"));


const router = createBrowserRouter([
  {
    path: "connect",
    element: (
      <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json">
      <div className="flex flex-col w-screen h-screen">
        <Header />
        <Body activate="connect" />
      </div>
    </TonConnectUIProvider>
    ),
  },
  {
    path: "leaderboard",
    element: (
      <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json">
      <div className="flex flex-col w-screen h-screen">
        <Header />
        <Body activate="leaderboard" />
      </div>
    </TonConnectUIProvider>
    ),
  },
  {
    path: "*",
    element: (
      <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json">
      <div className="flex flex-col w-screen h-screen">
        <Header />
        <Body activate="leaderboard" />
      </div>
    </TonConnectUIProvider>
    ),
  },
]);

root.render(
  <RouterProvider router={router} />
);
