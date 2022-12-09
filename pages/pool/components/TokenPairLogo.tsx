import { ICoinInfo } from "@/types/misc";

export default function TokenPairLogo({
  xCoin,
  yCoin,
}: {
  xCoin: ICoinInfo;
  yCoin: ICoinInfo;
}) {
  return (
    <div className="relative h-[40px] w-[72px]">
      <div className="absolute top-0 left-0 h-[40px] w-[40px] translate-x-[20%] translate-y-1/4 transform">
        {xCoin.logo_url ? (
          <div
            className="absolute inset-0 rounded-lg bg-slate-200 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${xCoin.logo_url})` }}
          ></div>
        ) : (
          <div className="absolute inset-0 rounded-lg bg-slate-200 bg-cover bg-center bg-no-repeat"></div>
        )}
      </div>
      <div className="absolute top-0 right-0 h-[40px] w-[40px] transform">
        {yCoin.logo_url ? (
          <div
            className="absolute inset-0 rounded-lg bg-slate-200 bg-cover bg-center bg-no-repeat shadow-lg"
            style={{ backgroundImage: `url(${yCoin.logo_url})` }}
          ></div>
        ) : (
          <div className="absolute inset-0 rounded-lg bg-slate-200 bg-cover bg-center bg-no-repeat shadow-lg"></div>
        )}
      </div>
    </div>
  );
}
