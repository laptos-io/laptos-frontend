import { BigNumber, formatFixed } from "@ethersproject/bignumber";

import { BASIC_DECIMALS } from "@/constants/misc";
import { BondingCurve, PoolType } from "@/types/nft";
import { INFTPairMetadata } from "@/types/nftpair";

interface Props {
  data: INFTPairMetadata & {
    image?: string;
  };
}
export default function PoolItem({ data }: Props) {
  return (
    <div className="card mb-4 w-full p-4">
      <div className="mb-2 rounded-[10px] bg-[#F9FAFE] px-3 py-2">
        {data.tokenIds?.[0].token_data_id.collection}
      </div>
      <div className="mb-4">{data.tokenIds?.[0].token_data_id.creator}</div>
      <div className="mb-4 flex w-full items-center justify-between">
        {data.poolType === PoolType.NFT ? (
          <div className="inline-flex shrink-0 items-center text-xl font-bold">
            {data.tokenIds?.[0].token_data_id.collection} {"->"} APT
          </div>
        ) : data.poolType === PoolType.Token ? (
          <div className="inline-flex shrink-0 items-center text-xl font-bold">
            APT {"->"} {data.tokenIds?.[0].token_data_id.collection}{" "}
          </div>
        ) : (
          <div className="inline-flex shrink-0 items-center text-xl font-bold">
            {data.tokenIds?.[0].token_data_id.collection} {"<->"} APT
          </div>
        )}
        <div className="inline-flex max-w-xs flex-1 items-center justify-between bg-[#F9FAFE] px-3 py-[9px]">
          <span className="mr-2 shrink-0">Balance: </span>
          <div className="flex items-center">
            {data.poolType === PoolType.NFT ? (
              <>
                <span>{data.tokenIds?.length || 0} </span>
                <img
                  src={data.image}
                  alt=""
                  className="ml-1 h-4 w-4 rounded-full"
                />
              </>
            ) : data.poolType === PoolType.Token ? (
              <span>1.2 APT</span>
            ) : (
              <>
                <span>{data.tokenIds?.length || 0} </span>
                <img
                  src={data.image}
                  alt=""
                  className="ml-1 h-4 w-4 rounded-full"
                />
                <span className="ml-6">2.3 APT</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center space-x-3">
        <div className="flex flex-1 flex-col items-center justify-center space-y-2 rounded-[10px] bg-[#FAE8F2] px-[46px] py-[20px]">
          <span className="text-sm">Current Price</span>
          <span className="text-xl font-medium">
            {data.spotPrice ? formatFixed(data.spotPrice, BASIC_DECIMALS) : "-"}{" "}
            APT
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center space-y-2 rounded-[10px] bg-[#E6EEFA] px-[46px] py-[20px]">
          <span className="text-sm">Bonding Curve</span>
          <span className="text-xl font-medium">
            {data?.curveType === BondingCurve.Exponential
              ? "Exponential"
              : "Linear"}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center space-y-2 rounded-[10px] bg-[#FFF3DC] px-[46px] py-[20px]">
          <span className="text-sm">Delta</span>
          <span className="text-xl font-medium">
            {data.spotPrice ? formatFixed(data.spotPrice, BASIC_DECIMALS) : "-"}{" "}
            APT
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center space-y-2 rounded-[10px] bg-[#4038FF]/[.15] px-[46px] py-[20px]">
          <span className="text-sm">Volume</span>
          <span className="text-xl font-medium">
            {"23.2"}
            APT
          </span>
        </div>
      </div>
    </div>
  );
}
