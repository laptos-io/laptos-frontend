import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Fragment, useMemo } from "react";

import { BondingCurve } from "@/types/nft";

interface Props {
  value: BondingCurve;
  onChange: (value: BondingCurve) => void;
}

const options = [
  { text: "Linear Curve", value: BondingCurve.Linear },
  { text: "Exponential Curve", value: BondingCurve.Exponential },
];
export default function SelectBondingCurve({ value, onChange }: Props) {
  const activeOpt = useMemo(
    () => options.find((opt) => opt.value === value),
    [value]
  );
  return (
    <div className="relative w-full">
      <Menu as="div" className="block relative w-full">
        <Menu.Button className="inline-flex h-10 w-full justify-center overflow-hidden rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {activeOpt?.text}
          <ChevronDownIcon
            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-1/2 z-10 mt-2 w-56 origin-top-right -translate-x-1/2 transform divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {options.map((opt) => (
              <div className="px-1 py-1 " key={opt.value}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-primary/80 text-white" : "text-gray-900"
                      } flex group w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => onChange(opt.value)}
                    >
                      {opt.text}
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
