import { atom } from "recoil";

import { ICoinInfo } from "@/types/misc";

interface CoinListState {
  isOpen: boolean;
  items: ICoinInfo[];
}

export const coinListState = atom({
  key: "coinsList",
  default: {
    isOpen: false,
    items: [],
  } as CoinListState,
});
