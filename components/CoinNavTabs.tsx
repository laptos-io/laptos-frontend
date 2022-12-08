import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";

import { networkState } from "@/recoil/network";

export default function CoinNavTabs() {
  const { network } = useRecoilValue(networkState);

  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="flex w-full justify-center">
      <nav className="inline-flex space-x-14" aria-label="Tabs">
        <Link passHref href={`/swap?network=${network}`}>
          <a
            className={`relative inline-block h-12 pb-4 ${
              pathname === "/swap" ? "text-primary" : "text-text-default"
            }`}
          >
            <span className="text-[28px] font-semibold">Swap</span>
            <span
              className={`absolute bottom-0 left-1/2 h-1.5 w-10 -translate-x-1/2 transform rounded bg-primary transition-opacity ${
                pathname === "/swap" ? "opacity-100" : "opacity-0"
              }`}
            ></span>
          </a>
        </Link>

        <Link passHref href={`/pool?network=${network}`}>
          <a
            className={`relative inline-block h-12 pb-4 ${
              pathname === "/pool" ? "text-primary" : "text-text-default"
            }`}
          >
            <span className="text-[28px] font-semibold">Pool</span>
            <span
              className={`absolute bottom-0 left-1/2 h-1.5 w-10 -translate-x-1/2 transform rounded bg-primary transition-opacity ${
                pathname === "/pool" ? "opacity-100" : "opacity-0"
              }`}
            ></span>
          </a>
        </Link>
      </nav>
    </div>
  );
}
