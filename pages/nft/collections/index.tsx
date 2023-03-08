import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

import Table, { TableCol } from "@/components/base/table/Table";
import { networkState } from "@/recoil/network";
import { ICollection } from "@/types/nft";

const MOCK_DATA: ICollection[] = [
  {
    name: "BAYC",
    type: "BAYC",
    listing: 887,
    floorPrice: "68.2",
    bestOffer: "-",
    offerTVL: "30.657",
    volumn: "2038.18",
  },
  {
    name: "MAYC",
    type: "MAYC",
    listing: 887,
    floorPrice: "68.2",
    bestOffer: "-",
    offerTVL: "30.657",
    volumn: "2038.18",
  },
  {
    name: "Azuki",
    type: "Azuki",
    listing: 887,
    floorPrice: "68.2",
    bestOffer: "-",
    offerTVL: "30.657",
    volumn: "2038.18",
  },
  {
    name: "Invisible Friends",
    type: "Invisible",
    listing: 887,
    floorPrice: "68.2",
    bestOffer: "-",
    offerTVL: "30.657",
    volumn: "2038.18",
  },
  {
    name: "Doodles",
    type: "Doodles",
    listing: 887,
    floorPrice: "68.2",
    bestOffer: "-",
    offerTVL: "30.657",
    volumn: "2038.18",
  },
  {
    name: "Crypto Punks",
    type: "Crypto",
    listing: 887,
    floorPrice: "68.2",
    bestOffer: "-",
    offerTVL: "30.657",
    volumn: "2038.18",
  },
];

export default function CollectionsPage() {
  const { network } = useRecoilValue(networkState);
  const router = useRouter();
  const tableColumns: TableCol[] = useMemo(() => {
    return [
      {
        label: "Name",
        prop: "name",
      },
      {
        label: "Listing",
        prop: "listing",
      },
      {
        label: "Floor Price",
        prop: "floorPrice",
      },
      {
        label: "Best offer",
        prop: "bestOffer",
      },
      {
        label: "Offer TVL",
        prop: "offerTVL",
      },
      {
        label: "Volumn",
        prop: "volumn",
      },
    ];
  }, []);
  return (
    <div className="container mx-auto h-full w-full px-5 py-2">
      <h1 className="mb-3 text-center text-[32px] font-bold">Collections</h1>
      <p className="text-center">Don‘t see a collection you want?</p>
      <p className="mb-4 text-center">
        <span>
          Directly{" "}
          <Link href={""} passHref>
            <a className="text-primary">list your NFTs</a>
          </Link>{" "}
          ，or{" "}
          <Link href={""} passHref>
            <a className="text-primary">
              create a new pool to buy and sell in bulk.
            </a>
          </Link>{" "}
        </span>
      </p>
      <Table
        data={MOCK_DATA}
        columns={tableColumns}
        onClickRow={(row) =>
          router.push(`/nft/collections/${row.type}?network=${network}`)
        }
      />
    </div>
  );
}
