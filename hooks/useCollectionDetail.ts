import { parseFixed } from "@ethersproject/bignumber";

import { BASIC_DECIMALS } from "@/constants/misc";
import { MarketPlaceCollection } from "@/types/nft";

const images = [
  "https://i.seadn.io/gae/CdfWxZtiC8zWloxRE5EspzzDVXM1P9c1Z0MZ0Bw4u8K4WA_R41W_IvcIfONnam3LyRXcg7uEqteb75YdT8CfO0UJy0GJj_0AvmUBww?auto=format&w=640",
  "https://i.seadn.io/gae/5r0xsU5zEAs8D9b2x_DD3-tZ0E_IgT5j4QQhs2imTSWgG1uobxrjPbYK0s22BZ23J9w5ODeebAS5AHOLvkpMTptjYWZtphlvTi5B?auto=format&w=640",
  "https://i.seadn.io/gae/_cPliwofEAHVmStDZ2a_OlVIgTfTQrvdLDoO6-PDk80D9wErUuHaIrHQ16x875T4BUV6GCxTBx1-PLrYa9lHMOOHH0kJ3rIQb-ejPw?auto=format&w=640",
  "https://i.seadn.io/gae/C21jM8zXpfWblZhzq-j5BENzetODjV1bhyeHdjyFT7jrjneZcDtYhKswangv9wCjhrzr4gJ7fOhZInp9EHbxWlfIyyyCTHYV-TpOVg?auto=format&w=640",
];
const mockData: MarketPlaceCollection = {
  name: "Aptos BAYC",
  creator: "",
  image:
    "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&w=256",
  items: Array.from({ length: 48 })
    .fill(null)
    .map((_, index) => {
      return {
        price: {
          displayed: "21.20",
          value: parseFixed("21.20", BASIC_DECIMALS),
        },
        tokenId: {
          token_data_id: {
            collection: "Aptos BAYC",
            creator: "",
            name: `BAYC #${index + 1}`,
          },
          property_version: "1",
        },
        image: images[index % images.length],
      };
    }),
};
export default function useCollectionDetail(name: string) {
  return {
    data: mockData,
  };
}
