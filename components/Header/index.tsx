import Image from "next/image";
import Link from "next/link";
import { useWindowScroll } from "react-use";
import { useRecoilValue } from "recoil";

import { networkState } from "@/recoil/network";

import Account from "./Account";
import SearchBox from "./SearchBox";

export default function Header() {
  const { network } = useRecoilValue(networkState);
  const { y } = useWindowScroll();
  return (
    <header
      className={`flex fixed inset-x-0 top-0 z-20 h-20 items-center justify-between px-8 py-0 ${
        y && y > 1 ? "bg-white shadow" : "bg-transparent"
      }`}
    >
      <div className="inline-flex items-center justify-start space-x-3">
        <Link passHref href={`/?network=${network}`}>
          <a>
            <Image width={120} height={40} src="/logo-full.svg" alt="logo" />
          </a>
        </Link>

        <SearchBox className="hidden sm:block sm:w-48 lg:w-60 2xl:w-80" />

        <Link passHref href={`/nft/collections?network=${network}`}>
          <a className="rounded-lg bg-primary/20 px-3 py-2 font-medium leading-6 text-primary transition-colors hover:bg-primary/30">
            Collections
          </a>
        </Link>
      </div>

      <div className="inline-flex items-center justify-start space-x-3">
        <Link passHref href={`/nft?network=${network}`}>
          <a className="rounded-lg bg-primary/20 px-3 py-2 font-medium leading-6 text-primary transition-colors hover:bg-primary/30">
            Your NFTs
          </a>
        </Link>
        <Link passHref href={`/pools?network=${network}`}>
          <a className="rounded-lg bg-primary/20 px-3 py-2 font-medium leading-6 text-primary transition-colors hover:bg-primary/30">
            Your Pools
          </a>
        </Link>
        <Account />
      </div>
    </header>
  );
}
