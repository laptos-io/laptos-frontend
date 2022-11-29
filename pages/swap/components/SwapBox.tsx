import useAptosClient from "@/hooks/useAptosClient";
import useCoinBalance from "@/hooks/useCoinBalance";
import useCoinList from "@/hooks/useCoinList";
import { ICoinInfo } from "@/types/misc";

const CoinWithBalance = ({ coinInfo }: { coinInfo: ICoinInfo }) => {
  const balance = useCoinBalance(coinInfo?.token_type?.type);
  return (
    <div className="">
      <span className="">{coinInfo.symbol}: </span>
      <span>{balance?.displayed || "0"}</span>
    </div>
  );
};
const SwapBox = () => {
  const aptosClient = useAptosClient();

  const coinList = useCoinList();
  return (
    <>
      <div className="card mx-auto w-screen max-w-[600px]">
        {aptosClient.nodeUrl}

        <div className="">
          <h2>Account Balance: </h2>
          {coinList?.slice(0, 1).map((coin) => {
            return <CoinWithBalance key={coin.symbol} coinInfo={coin} />;
          })}
        </div>
      </div>
    </>
  );
};

export default SwapBox;
