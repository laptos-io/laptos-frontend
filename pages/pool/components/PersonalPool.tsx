import useAptosClient from "@/hooks/useAptosClient";
import useCoinBalance from "@/hooks/useCoinBalance";
import { ICoinInfo } from "@/types/misc";

const PersonalPool = () => {
  const aptosClient = useAptosClient();

  return (
    <div className="w-full">
      <div className="card flex w-full items-center justify-start rounded-3xl">
        <div className="flex flex-1 flex-col items-center">
          <div className=" text-base text-text-placeholder">
            Total Value Locked
          </div>
          <div className="text-[28px] font-semibold text-text-default">
            $1 191 281
          </div>
        </div>
        <div className="mx-4 h-[54px] w-0 shrink-0 border-l border-slate-200"></div>
        <div className="flex flex-1 flex-col items-center">
          <div className=" text-base text-text-placeholder">
            Total Value Locked
          </div>
          <div className="text-[28px] font-semibold text-text-default">
            $1 191 281
          </div>
        </div>
        <div className="mx-4 h-[54px] w-0 shrink-0 border-l border-slate-200"></div>
        <div className="flex flex-1 flex-col items-center">
          <div className=" text-base text-text-placeholder">
            Total Value Locked
          </div>
          <div className="text-[28px] font-semibold text-text-default">
            $1 191 281
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalPool;
