import { useMemo } from "react";
import { useRecoilValue } from "recoil";

import { FT_SWAP_ADDRESSES } from "@/constants/contracts";
import useNFTMetadataHandle from "@/hooks/useNFTMetadataHandle";
import useNFTPools from "@/hooks/useNFTPools";
import usePoolNums from "@/hooks/usePoolNums";
import { networkState } from "@/recoil/network";

import MyNFTPoolItem from "./components/MyNFTPoolItem";

export default function MyPoolsPage() {
  const { network } = useRecoilValue(networkState);

  const { data: poolNumsHandleData } = usePoolNums(
    FT_SWAP_ADDRESSES[network],
    5000
  );
  const poolNumsHandle = useMemo(
    () => (poolNumsHandleData?.data as any)?.poolNums?.handle,
    [poolNumsHandleData?.data]
  );

  const { data: serialNumData } = useNFTPools(poolNumsHandle, 5000);

  const serialNum = useMemo(() => {
    return serialNumData as unknown as string;
  }, [serialNumData]);

  const serialNums = useMemo(() => {
    if (!serialNum || !+serialNum) return [];
    const res = [];
    for (let index = 1; index <= +serialNum; index++) {
      res.push(index);
    }
    return res;
  }, [serialNum]);

  const { data: NFTMetadataHandleData } = useNFTMetadataHandle(
    FT_SWAP_ADDRESSES[network],
    10_000
  );

  const NFTMetadataHandle = useMemo(
    () => (NFTMetadataHandleData?.data as any)?.pools?.inner?.handle,
    [NFTMetadataHandleData?.data]
  );

  return (
    <div className="h-full w-full">
      <div className="flex w-full flex-col items-center justify-center bg-primary py-[60px] px-10">
        <h1 className="mb-3 text-[40px] font-medium leading-tight text-white">
          My Pools
        </h1>
      </div>
      <div className="container mx-auto py-11">
        {NFTMetadataHandle ? (
          <div className="grid grid-cols-4 gap-5">
            {serialNums.map((sn) => (
              <MyNFTPoolItem
                key={sn}
                serialNum={sn.toString()}
                handleString={NFTMetadataHandle}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
