import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header/Header";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Body from "./components/body/Body";
import Footer from "./components/footer/Footer";
const root = ReactDOM.createRoot(document.getElementById("react-target"));

root.render(
  <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json">
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <Body />
      <Footer />
    </div>
  </TonConnectUIProvider>
);
