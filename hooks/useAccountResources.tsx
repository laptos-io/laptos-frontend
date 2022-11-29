import { useCallback } from "react";

import useAptosClient from "./useAptosClient";
import useAptosWallet from "./useAptosWallet";

function useAccountResources() {
  const { connected, activeWallet } = useAptosWallet();
  const aptosClient = useAptosClient();

  const walletAddress = activeWallet?.toString();

  const getData = useCallback(async () => {
    const resources = await aptosClient.getAccountResources(walletAddress!);
  }, [aptosClient, walletAddress]);
}
