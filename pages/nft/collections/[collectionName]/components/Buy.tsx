import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import Link from "next/link";
import { useEffect } from "react";

import { BASIC_DECIMALS } from "@/constants/misc";
import useAddToCart from "@/hooks/carts/useAddToCart";
import { ICollectionItem } from "@/types/nft";

interface Props {
  data?: ICollectionItem[];
}
export default function Buy({ data }: Props) {
  useEffect(() => {
    data?.sort((a, b) =>
      a.price && b.price && a.price?.lt(b?.price) ? -1 : 1
    );
  }, [data]);

  const handleAddToCart = useAddToCart();
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {data?.map((item) => {
        return (
          <div
            key={item.name}
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
            <div className="mb-1.5 text-sm text-secondary">{item.name}</div>
            <div className="mb-1 text-lg font-bold">
              {item.token_data_id.collection}
            </div>
            <div className="mb-4 flex space-x-2 font-semibold text-primary/70">
              {item.price && BigNumber.isBigNumber(item.price)
                ? formatFixed(item.price.toString(), BASIC_DECIMALS)
                : ""}{" "}
              APT
            </div>
            <button
              className="block w-full rounded-lg border border-primary px-3 py-1.5 text-center leading-5 text-primary hover:bg-primary hover:text-white"
              onClick={() => handleAddToCart(item)}
            >
              View Item
            </button>
          </div>
          // <div key={item.name} className="">
          //   <img src={item.image} alt="" />
          //   <div className="font-medium">{item.name}</div>
          //   <div className="">
          //     {item.price && BigNumber.isBigNumber(item.price)
          //       ? formatFixed(item.price.toString(), BASIC_DECIMALS)
          //       : ""}{" "}
          //     APT
          //   </div>
          // </div>
        );
      })}
    </div>
  );
}
