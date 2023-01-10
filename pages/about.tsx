import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRecoilValue } from "recoil";

import { networkState } from "@/recoil/network";

const About: NextPage = () => {
  const { network } = useRecoilValue(networkState);
  return (
    <>
      <Head>
        <title>Laptos - About</title>
      </Head>
      <div className="mt-20 h-auto w-full pt-24">
        <section className="container mx-auto mb-24 max-w-4xl px-5 text-center">
          <div className="mb-5 text-2xl font-extrabold uppercase sm:text-[40px]">
            about laptos
          </div>
          <p className="text-base text-slate-500">
            Laptos is a innovative token exchange build on Aptos. Users could
            trade NFT and FT on one platform with the same experience. With L
            aptos user could experience smooth transaction and secure
            experience.
          </p>
        </section>

        <section className="relative min-h-0 w-full bg-about-bg-1 bg-contain bg-right bg-no-repeat py-16">
          <div className="container mx-auto flex h-full max-w-5xl items-center justify-between px-5 text-center">
            <div className="article max-w-md text-left">
              <div className="text-lg font-bold sm:text-2xl">
                The Highlights of NFT swap
              </div>
              <ul className="ml-5 mt-5 list-disc text-left font-light text-[#081735]">
                <li className="mb-3">
                  Stable swap of correlated tokens using XYK curves
                </li>
                <li className="mb-3">
                  Swap of uncorrelated tokens by smart routing
                </li>
              </ul>
            </div>

            <div className="relative h-[340px] w-[336px]">
              <Image
                src={"/images/about-diamond-1.svg"}
                width={336}
                height={340}
                layout="responsive"
                className="absolute inset-0"
                alt=""
              ></Image>
            </div>
          </div>
        </section>

        <section className="relative min-h-0 w-full bg-about-bg-2 bg-contain bg-left bg-no-repeat py-16">
          <div className="container mx-auto h-full max-w-5xl items-center justify-between px-5 text-center sm:flex sm:flex-row-reverse">
            <div className="article max-w-md text-left">
              <div className="text-lg font-bold sm:text-2xl">
                The Highlights of NFT swap
              </div>
              <ul className="ml-5 mt-5 list-disc text-left font-light text-[#081735]">
                <li className="mb-3">
                  AMM protocol for NFT and supporting three types of curves:
                  linear, exponential and XYK
                </li>
                <li className="mb-3">
                  Support for users to create buy-only, sell-only and buy-sell
                  transaction pools of three types
                </li>
                <li className="mb-3">Support for NFT and Token exchange</li>
                <li className="mb-3">Support for NFT and NFT interchange</li>
                <li className="mb-3">
                  Support for both normal swap and robust swap (Robust Swap)
                  types when swapping from NFT to Token or from Token to NFT{" "}
                </li>
              </ul>
            </div>

            <div className="relative h-[340px] w-[336px]">
              <Image
                src={"/images/about-diamond-2.svg"}
                width={336}
                height={340}
                layout="responsive"
                className="absolute inset-0"
                alt=""
              ></Image>
            </div>
          </div>
        </section>
        <footer className="mt-12 flex items-center justify-center space-x-3 py-6">
          <a
            href=""
            className="inline-block hover:opacity-70"
            target={"_blank"}
          >
            <span className="relative inline-block h-10 w-10">
              <Image
                src={"/images/icon-twitter.svg"}
                width={40}
                height={40}
                className="absolute inset-0"
                alt="twitter"
                layout="fill"
              ></Image>
            </span>
          </a>

          <a
            href=""
            className="inline-block hover:opacity-70"
            target={"_blank"}
          >
            <span className="relative inline-block h-10 w-10">
              <Image
                src={"/images/icon-discord.svg"}
                width={40}
                height={40}
                className="absolute inset-0"
                alt="discord"
                layout="fill"
              ></Image>
            </span>
          </a>

          <a
            href=""
            className="inline-block hover:opacity-70"
            target={"_blank"}
          >
            <span className="relative inline-block h-10 w-10">
              <Image
                src={"/images/icon-github.svg"}
                width={40}
                height={40}
                className="absolute inset-0"
                alt="github"
                layout="fill"
              ></Image>
            </span>
          </a>
        </footer>
      </div>
    </>
  );
};

export default About;
