import Image from "next/image";
import Link from "next/link";

import Account from "./Account";
import SearchBox from "./SearchBox";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-20 items-center justify-between px-8 py-0 shadow">
      <div className="inline-flex items-center justify-start space-x-3">
        <Link href="/">
          <Image width={120} height={40} src="/logo-full.svg" alt="logo" />
        </Link>

        <SearchBox className="hidden sm:block sm:w-48 lg:w-60 2xl:w-80" />

        <Link passHref href="/collections">
          <a className="rounded-lg bg-primary/20 px-3 py-2 font-medium leading-6 text-primary transition-colors hover:bg-primary/30">
            Collections
          </a>
        </Link>
      </div>

      <div className="inline-flex items-center justify-start space-x-3">
        <Link passHref href="/nfts">
          <a className="rounded-lg bg-primary/20 px-3 py-2 font-medium leading-6 text-primary transition-colors hover:bg-primary/30">
            Your NFTs
          </a>
        </Link>
        <Link passHref href="/pools">
          <a className="rounded-lg bg-primary/20 px-3 py-2 font-medium leading-6 text-primary transition-colors hover:bg-primary/30">
            Your Pools
          </a>
        </Link>
        <Account />
      </div>
    </header>
  );
}
