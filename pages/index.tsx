import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRecoilValue } from "recoil";

import { networkState } from "@/recoil/network";

const Home: NextPage = () => {
  const { network } = useRecoilValue(networkState);
  return (
    <div className="flex relative h-screen flex-col items-center justify-center py-2">
      <div className="absolute inset-0">
        <div className="absolute left-0 bottom-0 h-[485px] w-[448px] bg-home-left-bottom bg-cover bg-center bg-no-repeat">
          <div className="absolute right-[45%] top-[6%] h-[82px] w-[79px]">
            <Image
              src={"/images/diamond-1.png"}
              width={118}
              height={122}
              layout="responsive"
              className="absolute inset-0"
              alt=""
            ></Image>
          </div>

          <div className="absolute right-[15%] bottom-[15%] h-[64px] w-[58px]">
            <Image
              src={"/images/diamond-2.png"}
              width={82}
              height={75}
              layout="responsive"
              className="absolute inset-0"
              alt=""
            ></Image>
          </div>
        </div>

        <div className="absolute right-[0%] bottom-[0%] h-[100vh] w-[94vh] bg-home-right-bg bg-cover bg-center bg-no-repeat">
          <div className="absolute right-[0%] top-1/2 h-[75%] w-[70%] -translate-y-1/2 transform bg-home-right bg-cover bg-center bg-no-repeat">
            {/* <Image
              src={"/images/diamond-2.png"}
              width={82}
              height={75}
              layout="responsive"
              className="absolute inset-0"
              alt=""
            ></Image> */}
          </div>
          <div className="absolute left-[54%] top-[22%] h-[64px] w-[58px]">
            <Image
              src={"/images/diamond-circles.png"}
              width={82}
              height={75}
              layout="responsive"
              className="absolute inset-0"
              alt=""
            ></Image>
          </div>
        </div>
      </div>
      <div className="flex container relative mx-auto flex-col items-center justify-center">
        <div className="mb-6 text-7xl font-extrabold uppercase">
          Welcome to Laptos
        </div>
        <p className="text-center text-lg text-[#6B7196]">
          Buidl in Move: a new smart contract language designed with security in
          mind.
        </p>
        <p className="text-center text-lg text-[#6B7196]">
          Also benefit from Aptos' parallel transaction execution engine for a
          smooth transaction experience.
        </p>
        <div className="flex mt-20 items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="flex flex-col items-center justify-center space-y-5">
            <Link passHref href={`/swap?network=${network}`}>
              <a className="inline-block w-full rounded-xl bg-primary px-3 py-3 text-center font-semibold leading-6 text-white transition-colors hover:bg-primary-lighter sm:w-[160px]">
                FT Swap
              </a>
            </Link>
            <p className=" text-xs text-[#6B7196]">The first DEX on Aptos</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-5">
            <button className="inline-block w-full rounded-xl bg-primary px-3 py-3 text-center font-semibold leading-6 text-white transition-colors hover:bg-primary-lighter sm:w-[160px]">
              NFT Swap
            </button>
            <p className=" text-xs text-[#6B7196]">
              Send & store tokens on Aptos
            </p>
          </div>
        </div>
      </div>

      <Link href={`/about`} passHref>
        <a
          target={"_blank"}
          className="absolute bottom-0 left-1/2 h-[40px] w-[236px] -translate-x-1/2 transform hover:opacity-75"
        >
          <Image
            src={"/images/home-learn-about.svg"}
            width={236}
            height={40}
            layout="responsive"
            className="absolute inset-0"
            alt=""
          ></Image>
        </a>
      </Link>
    </div>
  );
};

export default Home;
