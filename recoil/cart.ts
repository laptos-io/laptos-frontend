import { TokenTypes } from "aptos";
import { atom, selector } from "recoil";

export interface ICartItem {
  tokenId: TokenTypes.TokenId;
  price: string;
}

interface CartState {
  isOpen: boolean;
  items: ICartItem[];
}

export const cartState = atom({
  key: "Wallet",
  default: {
    isOpen: false,
    items: [],
  } as CartState,
});
