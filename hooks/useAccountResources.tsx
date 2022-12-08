import { MaybeHexString } from "aptos";
import { MoveResource } from "aptos/src/generated";
import useSWR from "swr";

import useAptosClient from "./useAptosClient";

export default function useAccountResources(accountAddress?: MaybeHexString) {
  const aptosClient = useAptosClient();

  return useSWR<MoveResource[], unknown>(
    accountAddress ? accountAddress : undefined,
    () => aptosClient.getAccountResources(accountAddress!),
    { refreshInterval: 0 }
  );
  // const [pending, setPending] = useState(false);
  // const [data, setData] = useState<MoveResource[]>();
  // const [error, setError] = useState<unknown>();

  // const getAccountResources = useCallback(async () => {
  //   if (pending || !accountAddress) return null;
  //   try {
  //     const resources = await aptosClient.getAccountResources(accountAddress!);
  //     setData(resources);
  //   } catch (error) {
  //     setError(error);
  //   }
  //   setPending(false);
  // }, [accountAddress, aptosClient, pending]);

  // useEffect(() => {
  //   getAccountResources();
  // }, [getAccountResources]);

  // return useMemo(() => {
  //   return {
  //     pending,
  //     data,
  //     error,
  //   };
  // }, [data, error, pending]);
}
