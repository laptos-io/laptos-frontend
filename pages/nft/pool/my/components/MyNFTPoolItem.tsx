import { formatFixed } from "@ethersproject/bignumber";

import { BASIC_DECIMALS } from "@/constants/misc";
import useNFTPairMetadata from "@/hooks/useNFTPairMetadata";
import { BondingCurve } from "@/types/nft";

export default function MyNFTPoolItem({
  handleString,
  serialNum,
}: {
  handleString: string;
  serialNum: string;
}) {
  const { data } = useNFTPairMetadata({ handleString, serialNum });

  return (
    <div className="w-full rounded-sm bg-white p-5 text-sm shadow-md">
      <div className="flex w-full items-center justify-between space-x-6">
        <div className="text-sm font-bold">
          {data?.tokenIds?.[0]?.token_data_id.collection}
        </div>
        <div className="text-sm text-slate-400">
          {data?.tokens?.length} tokens
        </div>
      </div>
      <div className="w-full">
        <div>PoolType: {data?.poolType}</div>
        <div>
          SpotPrice:{" "}
          {data?.spotPrice
            ? formatFixed(data?.spotPrice.toString(), BASIC_DECIMALS)
            : undefined}{" "}
          APT
        </div>
        <div>Bounding Curve: {data?.curveType}</div>
        <div>
          Delta:{" "}
          {data?.delta
            ? data?.curveType === BondingCurve.Linear
              ? `${formatFixed(data?.delta.toString(), BASIC_DECIMALS)} APT`
              : `${formatFixed(data?.delta, BASIC_DECIMALS)} %`
            : undefined}{" "}
        </div>
      </div>
    </div>
  );
}
