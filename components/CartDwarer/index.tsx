import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment, useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { BASIC_DECIMALS } from "@/constants/misc";
import { cartState, cartTotalPrice } from "@/recoil/cart";

export default function CartDrawer() {
  const [cartData, setCartData] = useRecoilState(cartState);
  const cartTotal = useRecoilValue(cartTotalPrice);
  const cartTotalDisplayed = useMemo(() => {
    return cartTotal ? formatFixed(cartTotal, BASIC_DECIMALS) : "0";
  }, [cartTotal]);
  const setOpen = useCallback(
    (value: boolean) => {
      setCartData((prevState) => {
        return {
          ...prevState,
          isOpen: !!value,
        };
      });
    },
    [setCartData]
  );

  const handleDeleteItem = useCallback(
    (index: number) => {
      setCartData((prevState) => {
        return {
          ...prevState,
          items: [
            ...prevState.items.slice(0, index),
            ...prevState.items.slice(index + 1),
          ],
        };
      });
    },
    [setCartData]
  );

  return (
    <Transition.Root show={cartData.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-lg bg-white">
                  <div className="flex h-full flex-col overflow-y-scroll py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z"
                                stroke="#1A2128"
                                strokeWidth="2"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.74 15.53L14.26 12L10.74 8.46997"
                                stroke="#1A2128"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="flex w-full items-center justify-between bg-[#EEF1F3] py-3 px-12">
                        <span>Buy Total:</span>
                        <span className="font-semibold text-primary">
                          {cartTotalDisplayed} APT
                        </span>
                      </div>
                      <div className="divide-y">
                        {cartData?.items?.map((cartItem, index) => {
                          return (
                            <div
                              key={index}
                              className="relative flex w-full items-center justify-between py-3 pr-12 pl-5"
                            >
                              <div className="inline-flex items-center space-x-2">
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="10"
                                    cy="10.5"
                                    r="10"
                                    fill="black"
                                  />
                                  <path
                                    d="M7.5791 6.79492H12.4918"
                                    stroke="#C6D825"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    d="M10.0354 6.79492V11.7669"
                                    stroke="#C6D825"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    d="M6.22192 11.7793V14.2501H8.71094"
                                    stroke="#C6D825"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    d="M13.7109 11.7793V14.2501H11.2219"
                                    stroke="#C6D825"
                                    strokeWidth="1.5"
                                  />
                                </svg>

                                <img
                                  src={cartItem.image}
                                  className="h-[75px] w-[75px] rounded-sm"
                                  alt=""
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {cartItem.tokenId.token_data_id.name}
                                  </span>
                                </div>
                              </div>
                              <div className="inline-flex items-center">
                                <span className="font-semibold text-primary">
                                  {cartItem.price
                                    ? formatFixed(
                                        cartItem.price,
                                        BASIC_DECIMALS
                                      )
                                    : "0"}{" "}
                                  APT
                                </span>
                              </div>
                              <button
                                className="absolute right-0 top-1/2 -mt-5 p-2"
                                onClick={() => handleDeleteItem(index)}
                              >
                                <svg
                                  width="24"
                                  height="25"
                                  viewBox="0 0 24 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M15 23.25H9C3.57 23.25 1.25 20.93 1.25 15.5V9.5C1.25 4.07 3.57 1.75 9 1.75H15C20.43 1.75 22.75 4.07 22.75 9.5V15.5C22.75 20.93 20.43 23.25 15 23.25ZM9 3.25C4.39 3.25 2.75 4.89 2.75 9.5V15.5C2.75 20.11 4.39 21.75 9 21.75H15C19.61 21.75 21.25 20.11 21.25 15.5V9.5C21.25 4.89 19.61 3.25 15 3.25H9Z"
                                    fill="#FF4242"
                                  />
                                  <path
                                    d="M17.8991 10.299H17.8291C14.3691 9.95901 10.9291 9.81901 7.51912 10.169L6.17912 10.299C6.0812 10.3094 5.98219 10.3002 5.88783 10.2721C5.79346 10.2439 5.70562 10.1974 5.62936 10.1351C5.55311 10.0728 5.48996 9.99595 5.44358 9.90909C5.39719 9.82223 5.36849 9.72704 5.35912 9.62901C5.33956 9.43149 5.3991 9.23427 5.52469 9.08057C5.65027 8.92687 5.83167 8.82922 6.02912 8.80901L7.36912 8.67901C10.8791 8.32901 14.4191 8.45901 17.9791 8.80901C18.3891 8.84901 18.6891 9.21901 18.6491 9.62901C18.6091 10.009 18.2791 10.299 17.8991 10.299Z"
                                    fill="#FF4242"
                                  />
                                  <path
                                    d="M14.2899 9.63996C14.1133 9.64028 13.9422 9.57827 13.8069 9.46485C13.6715 9.35144 13.5805 9.19389 13.5499 9.01996L13.4099 8.16996C13.3899 8.02996 13.3499 7.80996 13.3099 7.75996C13.3099 7.75996 13.2099 7.69996 12.8499 7.69996H11.1299C10.7599 7.69996 10.6599 7.75996 10.6599 7.75996C10.6399 7.79996 10.5999 8.01996 10.5799 8.15996L10.4399 9.01996C10.4056 9.21497 10.2965 9.38888 10.1358 9.50468C9.97523 9.62048 9.77576 9.66901 9.57989 9.63996C9.38488 9.60563 9.21097 9.49654 9.09517 9.33592C8.97937 9.1753 8.93084 8.97583 8.95989 8.77996L9.09989 7.91996C9.20989 7.27996 9.38989 6.20996 11.1299 6.20996H12.8499C14.5999 6.20996 14.7799 7.32996 14.8799 7.92996L15.0199 8.77996C15.0899 9.18996 14.8099 9.57996 14.4099 9.63996H14.2899Z"
                                    fill="#FF4242"
                                  />
                                  <path
                                    d="M14.1 18.8101H9.88996C7.35996 18.8101 7.24996 17.2901 7.17996 16.2801L6.74996 9.67011C6.7367 9.4712 6.803 9.27517 6.93427 9.12514C7.06555 8.97511 7.25104 8.88337 7.44996 8.87011C7.64887 8.85685 7.8449 8.92315 7.99493 9.05443C8.14496 9.1857 8.2367 9.3712 8.24996 9.57011L8.67996 16.1701C8.74996 17.1501 8.75996 17.3001 9.88996 17.3001H14.1C15.23 17.3001 15.24 17.1501 15.31 16.1701L15.74 9.57011C15.77 9.16011 16.11 8.84011 16.54 8.87011C16.95 8.90011 17.27 9.25011 17.24 9.67011L16.81 16.2701C16.74 17.2901 16.64 18.8101 14.1 18.8101Z"
                                    fill="#FF4242"
                                  />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0">
                      <div className="mb-0 flex w-full items-center justify-between bg-[#EEF1F3] py-3 px-12 text-sm">
                        <span>Next Cost:</span>
                        <span className="font-semibold text-primary">
                          {cartTotalDisplayed} APT
                        </span>
                      </div>
                      <div className="p-3">
                        <button className="h-10 w-full rounded-lg bg-primary py-2.5 text-center leading-5 text-white hover:bg-primary-lighter">
                          Swap
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
