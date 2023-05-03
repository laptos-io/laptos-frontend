import {
  BigNumber,
  BigNumberish,
  formatFixed,
  parseFixed,
} from "@ethersproject/bignumber";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { BASIC_DECIMALS, ZERO } from "@/constants/misc";
import useCollectionDetail from "@/hooks/useCollectionDetail";
import classNames from "@/lib/classNames";
import { BondingCurve, ICollectionItem, PoolType } from "@/types/nft";

import Buy from "./components/Buy";
import Pools from "./components/Pools";

enum Tab {
  Buy,
  Sell,
  Activity,
  Pools,
}

const calcCollectionItemPrice = ({
  spotPrice,
  delta,
  curveType,
  itemIndex,
}: {
  spotPrice: BigNumberish;
  delta: BigNumberish;
  curveType: BondingCurve;
  itemIndex: number;
}) => {
  spotPrice = BigNumber.from(spotPrice);
  delta = BigNumber.from(delta);
  const basicPrice = parseFixed("1", BASIC_DECIMALS);
  if (!spotPrice || BigNumber.from(spotPrice).eq(ZERO)) return ZERO;
  if (curveType === BondingCurve.Exponential) {
    delta = !delta ? ZERO : delta.div(100);
    let currentPrice = spotPrice;
    for (let index = 0; index < itemIndex; index++) {
      currentPrice = currentPrice.mul(basicPrice.add(delta)).div(basicPrice);
    }
    return currentPrice;
  } else {
    return spotPrice.add((delta || ZERO).mul(BigNumber.from(itemIndex + 1)));
  }
};
export default function NftDetailPage() {
  const router = useRouter();
  const { data } = useCollectionDetail(router.query.collectionName as string);
  console.log("@@@ data", data);
  const [activeTab, setActiveTab] = useState(Tab.Buy);

  const buyItems = useMemo(() => {
    if (!data?.items) return [];
    const { items } = data;
    const res: ICollectionItem[] = [];
    for (const poolItem of items) {
      const { spotPrice, tokenIds, poolType, delta, curveType } = poolItem;
      if (poolType === PoolType.Token) {
        continue;
      }
      // eslint-disable-next-line unicorn/no-for-loop
      for (let index = 0; index < tokenIds.length; index++) {
        const tokenItem = tokenIds[index];
        const tokenId = tokenItem.token_data_id.name.match(/#(\d+)$/)?.[1];

        res.push({
          ...tokenItem,
          image: `https://bafybeibgtdkejt77t4w2fl2kh36cokmj5vipwfsxsn2z2fx35trlvg2kc4.ipfs.nftstorage.link/${tokenId}.png`,
          price: calcCollectionItemPrice({
            spotPrice,
            delta,
            curveType,
            itemIndex: index,
          }),
          name: tokenItem.token_data_id.name,
        });
      }
    }
    return res;
  }, [data]);

  return (
    <div className="w-full">
      <div className="relative h-[180px] w-full">
        <img
          src="/images/collection-banner.jpg"
          className="absolute inset-0 h-full w-full"
          alt=""
        />
      </div>
      <div className="relative -mt-[68px] flex w-full flex-col items-center">
        <img
          className="mb-3 block h-[138px] w-[138px]"
          src={data?.coverImage || ""}
          alt={data?.name}
        />
        <h1 className="mb-8 text-center text-xl font-bold xl:text-[40px]">
          {data?.name}
        </h1>
        <div className="container mx-auto mb-10 flex items-center justify-around space-x-4">
          <div className="flex flex-col items-center">
            <div className="mb-1 text-xl text-[#434D56]">Floor Price</div>
            <div className="text-2xl font-bold">{data?.floorPrice} APT</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 text-xl text-[#434D56]">Best Offer</div>
            <div className="text-2xl font-bold">0.259 APT</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 text-xl text-[#434D56]">Offer TVL</div>
            <div className="text-2xl font-bold">19.7 APT</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 text-xl text-[#434D56]">Volumn</div>
            <div className="text-2xl font-bold">276.8 APT</div>
          </div>
        </div>
        <button className="mb-10 rounded-lg bg-primary px-4 py-2.5 leading-6 text-white">
          Make Collection Offer
        </button>
      </div>
      <div className="container mx-auto">
        <nav
          className="mx-auto hidden max-w-[640px] items-center justify-between rounded-full bg-white p-2.5 lg:flex lg:space-x-8 lg:py-2"
          aria-label="Global"
        >
          <button
            className={classNames(
              activeTab === Tab.Buy
                ? "bg-gray-100 text-gray-900"
                : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
              "inline-flex items-center rounded-full py-2.5 px-10 text-sm font-medium"
            )}
            onClick={() => setActiveTab(Tab.Buy)}
          >
            <span>Buy</span>
            <span className="ml-1 rounded-full bg-[#C6C9D8] px-2 text-sm leading-5">
              {buyItems?.length || 0}
            </span>
          </button>
          <button
            className={classNames(
              activeTab === Tab.Sell
                ? "bg-gray-100 text-gray-900"
                : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
              "inline-flex items-center rounded-full py-2.5 px-10 text-sm font-medium"
            )}
            onClick={() => setActiveTab(Tab.Sell)}
          >
            <span>Sell</span>
            <span className="ml-1 rounded-full bg-[#C6C9D8] px-2 text-sm leading-5">
              {0}
            </span>
          </button>
          <button
            className={classNames(
              activeTab === Tab.Activity
                ? "bg-gray-100 text-gray-900"
                : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
              "inline-flex items-center rounded-full py-2.5 px-10 text-sm font-medium"
            )}
            onClick={() => setActiveTab(Tab.Activity)}
          >
            <span>Activity</span>
          </button>
          <button
            className={classNames(
              activeTab === Tab.Pools
                ? "bg-gray-100 text-gray-900"
                : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
              "inline-flex items-center rounded-full py-2.5 px-10 text-sm font-medium"
            )}
            onClick={() => setActiveTab(Tab.Pools)}
          >
            <span>Pools</span>
            <span className="ml-1 rounded-full bg-[#C6C9D8] px-2 text-sm leading-5">
              {data?.items?.length || 0}
            </span>
          </button>
        </nav>
      </div>

      <div className="container mx-auto px-5 py-5">
        {activeTab === Tab.Buy && <Buy data={buyItems} />}
        {activeTab === Tab.Pools && <Pools data={data?.items} />}
      </div>
      {/* <div className="container mx-auto h-full w-full px-5 py-2">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data?.items?.map((item) => {
            return (
              <div
                key={item?.token_data_id?.name}
                className="card col-span-1 rounded-lg px-2 py-3 shadow hover:shadow-xl"
              >
                <div className="relative mb-3 w-full rounded bg-pink-200 pt-[100%]">
                  {item.image && (
                    <img
                      className="absolute inset-0 h-full w-full"
                      alt=""
                      src={item.image}
                    />
                  )}
                </div>
                <div className="mb-1.5 text-sm text-secondary">
                  {item.tokenId.token_data_id.name}
                </div>
                <div className="mb-1 text-lg font-bold">
                  {item.tokenId.token_data_id.collection}
                </div>
                <div className="mb-4 flex space-x-2 font-semibold text-primary/70">
                  {item.price.displayed} APT
                </div>
                <Link
                  href={`/nft/collections/BAYC/${item.tokenId.token_data_id.name}`}
                  passHref
                >
                  <a className="block w-full rounded-lg border border-primary px-3 py-1.5 text-center leading-5 text-primary hover:bg-primary hover:text-white">
                    View Item
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
}
