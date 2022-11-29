import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

import { CoinListMapping } from "@/constants/misc";
import { coinListState } from "@/recoil/coinList";
import { networkState } from "@/recoil/network";
import { Network } from "@/types/misc";

import Header from "./Header";
import WalletConnector from "./WalletConnector";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const Layout: React.FC<React.PropsWithChildren<{ children: ReactNode }>> = ({
  children,
}) => {
  const { query } = useRouter();
  const network = useMemo(() => {
    if (!query.network) return Network.Mainnet;
    if (Object.keys(Network).includes(query.network as Network)) {
      return query.network as Network;
    }
    return Network.Mainnet;
  }, [query.network]);
  const [networkStateData, setNetworkStateData] = useRecoilState(networkState);

  useEffect(() => {
    setNetworkStateData({
      network,
    });
  }, [network, setNetworkStateData]);

  const [coinListStateValue, setCoinListStateValue] =
    useRecoilState(coinListState);

  const { data: coinListData, error } = useSWR(
    CoinListMapping[network],
    fetcher,
    {}
  );

  console.log("@@@ coinListStateValue", coinListStateValue);

  useEffect(() => {
    setCoinListStateValue(coinListData);
  }, [coinListData, setCoinListStateValue]);

  const isLoading = !network || (!coinListData && !error);
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-white">
        <span>Loading....</span>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Laptos</title>
      </Head>

      <div className="w-full" key={networkStateData.network}>
        <Header />
        <WalletConnector />
        {children}
      </div>
    </>
  );
};

export default Layout;
