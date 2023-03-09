import Link from "next/link";

import useCollectionDetail from "@/hooks/useCollectionDetail";

export default function NftDetailPage() {
  const { data } = useCollectionDetail("BAYC");
  return (
    <div className="w-full">
      <div className="relative h-[180px] w-full">
        <img
          src="/images/collection-banner.jpg"
          className="absolute inset-0 h-full w-full"
          alt=""
        />
      </div>
      <div className="flex relative -mt-[68px] w-full flex-col items-center">
        <img
          className="block mb-3 h-[138px] w-[138px]"
          src={data.image || ""}
          alt={data.name}
        />
        <h1 className="mb-8 text-center text-xl font-bold xl:text-[40px]">
          {data.name}
        </h1>
        <div className="flex container mx-auto mb-10 items-center justify-around space-x-4">
          <div className="flex flex-col items-center">
            <div className="mb-1 text-xl text-[#434D56]">Floor Price</div>
            <div className="text-2xl font-bold">0.274 APT</div>
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
      <div className="container mx-auto h-full w-full px-5 py-2">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.items.map((item) => {
            return (
              <div
                key={item.tokenId.token_data_id.name}
                className="card col-span-1 rounded-lg p-2 shadow hover:shadow-xl"
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
                <div className="flex space-x-2 font-semibold text-primary/70">
                  {item.price.displayed} APT
                </div>
                <Link
                  href={`/nft/collections/BAYC/${item.tokenId.token_data_id.name}`}
                  className="hover;text-white w-full rounded-lg border border-primary px-3 py-1.5 leading-5 text-primary hover:bg-primary"
                >
                  View Item
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
