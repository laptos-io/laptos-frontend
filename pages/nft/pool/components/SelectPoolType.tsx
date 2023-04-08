import { RadioGroup } from "@headlessui/react";
import Image from "next/image";

import IconArrow from "@/assets/icons/icon-arrow.svg";
import IconNFT from "@/assets/icons/icon-nft.png";
import IconToken from "@/assets/icons/icon-token.png";
import IconTrade from "@/assets/icons/icon-trade.png";
import classNames from "@/lib/classNames";
import { CreatePoolStep, PoolType } from "@/types/nft";

interface Props {
  currentStep: CreatePoolStep;
  value?: PoolType;
  onChange: (value?: PoolType) => void;
  onChangeStep: (value: CreatePoolStep) => void;
}

const options = [
  {
    title: "Buy NFTs with tokens",
    value: PoolType.Token,
    icon1: IconNFT,
    icon2: IconToken,
    description:
      "You will deposit tokens and receive NFTs as people swap their NFTs for your deposited tokens.",
  },
  {
    title: "Sell NFTs for tokens",
    value: PoolType.NFT,
    icon1: IconToken,
    icon2: IconNFT,
    description:
      "You will deposit NFTs and receive tokens as people swap their tokens for your deposited NFTs.",
  },
  {
    title: "Do both and earn trading fees",
    value: PoolType.Trade,
    icon1: IconNFT,
    icon2: IconTrade,
    description:
      "You will deposit both NFTs and tokens and earn trading fees as people buy or sell NFTs using your pool.",
  },
];
export default function SelectPoolType({
  value,
  onChange,
  onChangeStep,
}: Props) {
  const selected = options.find((opt) => opt.value === value);
  return (
    <div className="w-full pb-10">
      <div className="flex w-full items-center justify-center space-x-9">
        <RadioGroup value={selected} onChange={(opt) => onChange(opt.value)}>
          <RadioGroup.Label className="block w-full text-center text-xl font-semibold leading-6 text-gray-900">
            I want to ...
          </RadioGroup.Label>

          <div className="mt-6 flex items-stretch justify-center space-x-9">
            {options.map((opt) => (
              <RadioGroup.Option
                key={opt.title}
                value={opt}
                className={({ active }) =>
                  classNames(
                    active ? "border-indigo-600 ring-2 ring-indigo-600" : "",
                    "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-transparent bg-white p-4 py-12 shadow-lg focus:outline-none sm:max-w-[376px]"
                  )
                }
              >
                {({ checked, active }) => (
                  <>
                    <span className="flex flex-1">
                      <span className="flex flex-col items-center">
                        <RadioGroup.Label
                          as="span"
                          className="mb-5 block text-base font-medium text-gray-900 lg:text-xl"
                        >
                          {opt.title}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="div"
                          className="mb-20 flex w-full items-center justify-center space-x-3 xl:space-x-6"
                        >
                          <div>
                            <Image
                              src={opt.icon1}
                              alt=""
                              className="h-12 w-12 lg:h-20 lg:w-20"
                              width={80}
                              height={80}
                            />
                          </div>
                          <div>
                            <Image
                              src={IconArrow}
                              alt=""
                              className="h-2 w-2.5 lg:h-4 lg:w-5"
                              width={20}
                              height={16}
                            />
                          </div>
                          <div>
                            <Image
                              src={opt.icon2}
                              alt=""
                              className="h-12 w-12 lg:h-20 lg:w-20"
                              width={80}
                              height={80}
                            />
                          </div>
                        </RadioGroup.Description>
                        <RadioGroup.Description
                          as="span"
                          className="mt-1 flex items-center text-sm text-[#6B7196]"
                        >
                          {opt.description}
                        </RadioGroup.Description>
                      </span>
                    </span>
                    <span
                      className={classNames(
                        active ? "border" : "border-2",
                        checked ? "border-indigo-600" : "border-transparent",
                        "pointer-events-none absolute -inset-px rounded-lg"
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
