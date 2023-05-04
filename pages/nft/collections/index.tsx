import { formatFixed, parseFixed } from "@ethersproject/bignumber";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

import Table, { TableCol } from "@/components/base/table/Table";
import { BASIC_DECIMALS } from "@/constants/misc";
import useAllPoolsForPublic from "@/hooks/useAllPoolsForPublic";
import { networkState } from "@/recoil/network";
import { ICollection } from "@/types/nft";
import { INFTPairMetadata } from "@/types/nftpair";

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
  const { data, error, isLoading } = useAllPoolsForPublic(11);
  const groupedData = useMemo(() => {
    const res: ICollection[] = [];

    for (const item of data) {
      const { tokenIds, poolType, spotPrice, delta } = item;
      if (!tokenIds?.length) {
        continue;
      }
      const {
        token_data_id: { collection },
      } = tokenIds?.[0] || {};
      const index = res.findIndex((i) => i.name === collection);
      if (index < 0) {
        res.push({
          name: collection,
          type: "",
          coverImage:
            "https://bafybeibgtdkejt77t4w2fl2kh36cokmj5vipwfsxsn2z2fx35trlvg2kc4.ipfs.nftstorage.link/4.png",
          listing: tokenIds.length,
          floorPrice: formatFixed(spotPrice.toString(), BASIC_DECIMALS),
          bestOffer: "-",
          offerTVL: "0",
          volumn: "100 APT",
        });
      } else {
        res[index] = {
          ...res[index],
          listing: res[index].listing + tokenIds.length,
          floorPrice:
            res[index].floorPrice &&
            spotPrice &&
            parseFixed(res[index].floorPrice!, BASIC_DECIMALS).lt(spotPrice)
              ? res[index].floorPrice
              : formatFixed(spotPrice.toString(), BASIC_DECIMALS),
        };
      }
    }
    return res;
  }, [data]);

  const tableColumns: TableCol[] = useMemo(() => {
    return [
      {
        label: "Name",
        prop: "name",
        render(rowData) {
          return (
            <div className="inline-flex items-center space-x-3">
              <img
                src={rowData.coverImage}
                alt=""
                className="h-10 w-10 overflow-hidden rounded-full"
              />
              <span className="font-medium">{rowData.name}</span>
            </div>
          );
        },
      },
      {
        label: "Listing",
        prop: "listing",
      },
      {
        label: "Floor Price",
        prop: "floorPrice",
        render(rowData) {
          return rowData?.floorPrice ? `${rowData.floorPrice} APT` : "-";
        },
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
          <Link href={`/nft/pool/create`} passHref>
            <a className="text-primary">
              create a new pool to buy and sell in bulk.
            </a>
          </Link>{" "}
        </span>
      </p>
      <Table
        data={groupedData}
        columns={tableColumns}
        onClickRow={(row) =>
          router.push(`/nft/collections/${row.name}`)
        }
      />
    </div>
  );
}
