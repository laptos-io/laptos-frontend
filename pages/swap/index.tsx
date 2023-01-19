import { BigNumber } from "@ethersproject/bignumber";
import { SignMessagePayload, useWallet } from "@manahippo/aptos-wallet-adapter";
import { NextPage } from "next";
import Head from "next/head";

import CoinNavTabs from "@/components/CoinNavTabs";
import useAptosWallet from "@/hooks/useAptosWallet";

import FaucetBox from "./components/FaucetBox";
import SwapBox from "./components/SwapBox";

const SwapPage: NextPage = () => {
  const { connected, activeWallet } = useAptosWallet();
  const { signMessage, signAndSubmitTransaction, signTransaction } =
    useWallet();

  const onSignMessage = async () => {
    try {
      const msgPayload: SignMessagePayload = {
        message: "Hello from ranlix",
        nonce: Date.now().toString(),
      };
      const signedMessage = await signMessage(msgPayload);
      const response =
        typeof signedMessage === "string"
          ? signedMessage
          : signedMessage.signature;
      console.log("signedMessage.response", response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="min-h-screen py-2 pt-28">
        <Head>
          <title>Laptos Swap</title>
        </Head>
        <div className="container mx-auto">
          <CoinNavTabs />
          <SwapBox />
          <FaucetBox />
        </div>
      </div>
    </>
  );
};

export default SwapPage;
