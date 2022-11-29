import { useWallet } from "@manahippo/aptos-wallet-adapter";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRecoilValue } from "recoil";

import XSwitch from "@/components/base/XSwitch";
import useAptosWallet from "@/hooks/useAptosWallet";
import { networkState } from "@/recoil/network";

const Home: NextPage = () => {
  const { activeWallet, connected, openModal, closeModal } = useAptosWallet();
  const { disconnect } = useWallet();

  const { network } = useRecoilValue(networkState);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div>
        {connected ? (
          <div>
            <div>Wallet: {activeWallet?.toString()}</div>
            <button onClick={disconnect}>Disconnect</button>
          </div>
        ) : (
          <button onClick={openModal}>Connect Wallet</button>
        )}
      </div>
      <XSwitch defaultChecked={false} onChange={(checked) => null} />
      <h2>{network}</h2>
      <Link href="/?network=Mainnet">
        <a className="text-primary underline">{"Mainnet"}</a>
      </Link>
      <Link href="/?network=Testnet">
        <a className="text-primary underline">{"Testnet"}</a>
      </Link>
    </div>
  );
};

export default Home;
