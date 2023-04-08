import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import useNFTPoolData from "@/hooks/useNFTPoolData";

export default function Page({ type, name }: { type: string; name: string }) {
  const { data: items } = useNFTPoolData(name);
  return (
    <div className="container mx-auto mb-24">
      <h1 className="mb-10 flex items-center justify-center space-x-4 text-center">
        <span className="text-[40px] font-bold">APT</span>
        <img
          className="h-[40px] w-[40px]"
          alt=""
          src="/images/icon-double-arrow.png"
        />
        <span className="text-[40px] font-bold">{name}</span>
      </h1>
      <div className="flex w-full items-stretch justify-start space-x-4">
        <div className="card w-[52%] p-5 shadow">
          <div className="mb-4 flex w-full items-center justify-between">
            <span className="text-[28px] font-bold">Assets</span>
            <button className="rounded bg-primary px-4 py-1.5 text-sm leading-5 text-white">
              Withdraw All
            </button>
          </div>
          <div className="w-full rounded-sm bg-[#F9FAFE] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-medium">Tokens</span>
              <div className="flex items-center space-x-3">
                <button className="rounded bg-[#F0EBFF] px-2 py-1.5 text-xs text-[#7256DA]">
                  Deposit
                </button>
                <button className="rounded bg-[#D9DEE2] px-2 py-1.5 text-xs text-black">
                  Withdraw
                </button>
              </div>
            </div>
            <div className="text-2xl font-medium">{"12.3"} APT</div>
          </div>

          <div className="flex h-[480px] w-full flex-col overflow-hidden rounded-sm bg-[#F9FAFE] p-5">
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <span className="text-lg font-medium">NFTs</span>
              <div className="flex items-center space-x-3">
                <button className="rounded bg-[#F0EBFF] px-2 py-1.5 text-xs text-[#7256DA]">
                  Deposit
                </button>
                <button className="rounded bg-[#D9DEE2] px-2 py-1.5 text-xs text-black">
                  Withdraw
                </button>
              </div>
            </div>
            <div className="mb-4 shrink-0 text-2xl font-medium">15</div>
            <div className="w-full flex-1 overflow-auto">
              <div className="grid grid-cols-4 gap-3">
                {items.map((item) => {
                  return (
                    <div
                      key={item.tokenId.token_data_id.name}
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
                      <div className="mb-1 text-sm text-secondary">
                        {item.tokenId.token_data_id.name}
                      </div>
                      <div className="mb-2 text-sm font-bold">
                        {item.tokenId.token_data_id.collection}
                      </div>
                      <Link
                        href={`/nft/collections/BAYC/${item.tokenId.token_data_id.name}`}
                        passHref
                      >
                        <a className="block w-full rounded-lg border border-primary px-3 py-1.5 text-center text-sm leading-5 text-primary hover:bg-primary hover:text-white">
                          View Item
                        </a>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-start space-y-4">
          <div className="card w-full p-5 shadow">
            <div className="mb-7 flex w-full items-center justify-between">
              <span className="text-[28px] font-bold">Pricing</span>
              <button className="rounded bg-primary px-4 py-1.5 text-sm leading-5 text-white">
                Edit
              </button>
            </div>
            <div className="flex w-full items-center space-x-4">
              <div className="flex h-[112px] flex-1 flex-col items-center justify-between rounded-2xl bg-[#FAE8F2] p-6">
                <div className="text-sm font-semibold">Current Price</div>
                <div className="text-lg font-bold">{"10"} APT</div>
              </div>
              <div className="flex h-[112px] flex-1 flex-col items-center justify-between rounded-2xl bg-[#E6EEFA] p-6">
                <div className="flex flex-col items-center justify-center text-sm font-semibold">
                  <span className="">Delta</span>
                  <span className="text-xs uppercase text-[#919BA3]">
                    {"Exponential"}
                  </span>
                </div>
                <div className="text-lg font-bold">{"0.20"}%</div>
              </div>
              <div className="flex h-[112px] flex-1 flex-col items-center justify-between rounded-2xl bg-[#FFF3DC] p-6">
                <div className="text-sm font-semibold">Swap Fee</div>
                <div className="text-lg font-bold">{"2.5"}%</div>
              </div>
            </div>
          </div>
          <div className="card w-full flex-1 p-5 shadow">
            <div className="mb-7 flex w-full items-center justify-between">
              <span className="text-[28px] font-bold">About</span>
            </div>
            <div className="mb-3">Pool Owner:</div>
            <div className="inline-block w-auto min-w-min rounded bg-[#F9FAFE] px-3 py-2">
              {"0xeeeee9cbfAbE59397FfdA11Fc5DF293E9bC5Db90"}
            </div>
            <div className="mt-4 w-full border-t border-slate-100 pt-4">
              <p className="mb-3 font-medium">
                This pool holds {name} and APT to earn swap fees
              </p>
              <p className="mb-3 text-[#6B7196]">
                Right now this pool will sell at{" "}
                <span className="text-[#081735]">0.00666 APT</span> and will buy
                at <span className="text-[#081735]">0.00629 APT</span>
              </p>
              <p className="mb-1 text-[#6B7196]">
                Each time this pool buys/sells an NFT, the price will be
                lowered/increased by{" "}
                <span className="text-[#081735]">0.7000%</span>
              </p>
              <p className="mb-3 text-[#6B7196]">
                Each time someone swaps with this pool, you will earn{" "}
                <span className="text-[#081735]">2%</span> of the swap amount as
                swap fee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = ({ params }: GetServerSidePropsContext) => {
  return {
    props: {
      type: params?.type,
      name: params?.name,
    },
  };
};
