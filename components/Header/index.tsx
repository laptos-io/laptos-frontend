import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { useWindowScroll } from "react-use";
import { useRecoilState, useRecoilValue } from "recoil";

import useAptosWallet from "@/hooks/useAptosWallet";
import { cartState } from "@/recoil/cart";
import { networkState } from "@/recoil/network";

import Account from "./Account";
import SearchBox from "./SearchBox";

export default function Header() {
  const { network } = useRecoilValue(networkState);
  const [cartData, setCartData] = useRecoilState(cartState);
  const { y } = useWindowScroll();
  const { connected } = useAptosWallet();
  const handleOpenCart = useCallback(() => {
    setCartData((prevState) => {
      return {
        ...prevState,
        isOpen: true,
      };
    });
  }, [setCartData]);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 flex h-20 items-center justify-between px-8 py-0 ${
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
        {/* <Link passHref href={`/nft?network=${network}`}>
          <a className="rounded-lg bg-primary/20 px-3 py-2 font-medium leading-6 text-primary transition-colors hover:bg-primary/30">
            Your NFTs
          </a>
        </Link> */}
        <Link passHref href={`/pool?network=${network}`}>
          <a className="rounded-lg bg-primary/20 px-3 py-2 font-medium leading-6 text-primary transition-colors hover:bg-primary/30">
            Your Pools
          </a>
        </Link>
        <Account />
        {connected && (
          <button className="relative inline-flex p-1">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.6667 30C22.2856 30 22.8791 29.7542 23.3167 29.3166C23.7542 28.879 24.0001 28.2855 24.0001 27.6667C24.0001 27.0478 23.7542 26.4543 23.3167 26.0167C22.8791 25.5792 22.2856 25.3333 21.6667 25.3333C21.0479 25.3333 20.4544 25.5792 20.0168 26.0167C19.5792 26.4543 19.3334 27.0478 19.3334 27.6667C19.3334 28.2855 19.5792 28.879 20.0168 29.3166C20.4544 29.7542 21.0479 30 21.6667 30ZM11.0001 30C11.6189 30 12.2124 29.7542 12.65 29.3166C13.0876 28.879 13.3334 28.2855 13.3334 27.6667C13.3334 27.0478 13.0876 26.4543 12.65 26.0167C12.2124 25.5792 11.6189 25.3333 11.0001 25.3333C10.3812 25.3333 9.78775 25.5792 9.35017 26.0167C8.91258 26.4543 8.66675 27.0478 8.66675 27.6667C8.66675 28.2855 8.91258 28.879 9.35017 29.3166C9.78775 29.7542 10.3812 30 11.0001 30ZM6.45341 5.25332L6.18675 8.51999C6.13341 9.14666 6.62675 9.66666 7.25342 9.66666H27.6667C28.2267 9.66666 28.6934 9.23999 28.7334 8.67999C28.9067 6.31999 27.1067 4.39999 24.7467 4.39999H8.36008C8.22675 3.81332 7.96008 3.25332 7.54675 2.78666C6.88008 2.07999 5.94675 1.66666 4.98675 1.66666H2.66675C2.12008 1.66666 1.66675 2.11999 1.66675 2.66666C1.66675 3.21332 2.12008 3.66666 2.66675 3.66666H4.98675C5.40008 3.66666 5.78675 3.83999 6.06675 4.13332C6.34675 4.43999 6.48008 4.83999 6.45341 5.25332ZM27.3467 11.6667H6.89341C6.33342 11.6667 5.88008 12.0933 5.82675 12.64L5.34675 18.44C5.30097 18.9774 5.36727 19.5184 5.54145 20.0289C5.71563 20.5393 5.99389 21.008 6.35862 21.4053C6.72335 21.8026 7.16659 22.1199 7.6603 22.337C8.154 22.5541 8.68741 22.6664 9.22675 22.6667H24.0534C26.0534 22.6667 27.8134 21.0267 27.9601 19.0267L28.4001 12.8C28.4128 12.6547 28.3949 12.5084 28.3475 12.3705C28.3001 12.2326 28.2244 12.1062 28.1251 11.9994C28.0258 11.8926 27.9053 11.8078 27.7712 11.7505C27.6371 11.6932 27.4925 11.6646 27.3467 11.6667Z"
                fill="#4038FF"
              />
            </svg>
            {cartData?.items.length && (
              <button
                className="absolute top-[-5px] right-[-5px] h-5 min-w-[20px] rounded-full bg-[#D9DEE2] px-1 text-center text-xs font-medium"
                onClick={handleOpenCart}
              >
                {cartData.items.length}
              </button>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
