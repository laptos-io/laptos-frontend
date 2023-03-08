import { SignMessagePayload, useWallet } from "@manahippo/aptos-wallet-adapter";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import CoinNavTabs from "@/components/CoinNavTabs";
import useAptosWallet from "@/hooks/useAptosWallet";
import classNames from "@/lib/classNames";

import AllPools from "./components/AllPools";
import PersonalPools from "./components/PersonalPools";

enum PoolTab {
  All,
  Mine,
}

const tabs = [
  {
    name: "All Pools",
    value: PoolTab.All,
  },
  {
    name: "Your Liquidity",
    value: PoolTab.Mine,
  },
];

const PoolPage: NextPage = () => {
  const { connected, activeWallet } = useAptosWallet();
  const { signMessage, signAndSubmitTransaction, signTransaction } =
    useWallet();

  const [activeTab, setActiveTab] = useState(PoolTab.All);

  return (
    <>
      <div className="min-h-screen py-2">
        <Head>
          <title>Laptos Pool</title>
        </Head>
        <div className="container mx-auto max-w-[1200px]">
          <CoinNavTabs />
          <div className="my-10 flex w-full justify-center 2xl:my-16">
            <nav
              className="mx-auto flex space-x-4 rounded-full bg-white p-2"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.value)}
                  className={classNames(
                    activeTab === tab.value
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-gray-500 hover:text-gray-700",
                    "min-w-[180px] rounded-full px-3 py-2 text-center text-base font-medium"
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          {activeTab === PoolTab.All ? <AllPools /> : <PersonalPools />}
        </div>
      </div>
    </>
  );
};

export default PoolPage;
