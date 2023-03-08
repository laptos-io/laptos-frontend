import { useEffect, useState } from "react";

import classNames from "@/lib/classNames";
import { CreatePoolStep, PoolType } from "@/types/nft";

import SelectAssets from "./components/SelectAssets";
import SelectPoolType from "./components/SelectPoolType";

const steps = [
  { name: "Selecting Pool Type", value: CreatePoolStep.SelectType },
  { name: "Selecting Assets", value: CreatePoolStep.SelectAssets },
  {
    name: "Configuring Pool Parameters",
    value: CreatePoolStep.ConfiguringPoolParameters,
  },
  { name: "Finalizing Deposit", value: CreatePoolStep.FinalizingDeposit },
];
export default function CreateNFTPoolPage() {
  const [currentStep, setCurrentStep] = useState(CreatePoolStep.SelectType);

  const [poolType, setPoolType] = useState<PoolType>();
  const [xType, setXType] = useState<string>();
  const [yType, setYType] = useState<string>();

  useEffect(() => {
    typeof poolType !== "undefined" &&
      setCurrentStep(CreatePoolStep.SelectAssets);
  }, [poolType]);

  return (
    <div className="h-full w-full">
      <div className="flex w-full flex-col items-center justify-center bg-primary py-[60px] px-10">
        <h1 className="mb-3 text-[40px] font-medium leading-tight text-white">
          Create Pool
        </h1>
        <p className=" max-w-xl text-lg text-white/70">
          Provide liquidity to buy, sell, or trade NFTs on your behalf.
        </p>
      </div>
      <div className="container mx-auto py-11">
        <div className="flex mb-8 w-full items-center  justify-center">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={classNames(
                    stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                    "relative"
                  )}
                >
                  <div
                    className="flex absolute inset-0 items-center"
                    aria-hidden="true"
                  >
                    <div className="h-px w-full bg-gray-200" />
                  </div>
                  <button
                    className="flex relative items-center justify-center space-x-2 bg-[#F1F6FF] px-2"
                    aria-current="step"
                    onClick={() => setCurrentStep(step.value)}
                  >
                    <span
                      className={classNames(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full  border border-primary text-lg leading-8",
                        currentStep === step.value
                          ? "bg-primary text-white"
                          : "bg-transparent text-primary"
                      )}
                    >
                      {stepIdx + 1}
                    </span>
                    <span
                      className={classNames(
                        "text-sm",
                        currentStep === step.value
                          ? "text-black"
                          : "text-[#A1A7BB]"
                      )}
                    >
                      {step.name}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div
          className={classNames(
            "w-full",
            typeof currentStep === "undefined" ||
              currentStep === CreatePoolStep.SelectType
              ? "block"
              : "hidden"
          )}
        >
          <SelectPoolType
            currentStep={currentStep}
            value={poolType}
            onChange={setPoolType}
          />
        </div>

        <div
          className={classNames(
            "w-full",
            currentStep === CreatePoolStep.SelectAssets ? "block" : "hidden"
          )}
        >
          <SelectAssets
            poolType={poolType}
            xType={xType}
            yType={yType}
            onChangeXtype={setXType}
            onChangeYtype={setYType}
          />
        </div>
      </div>
    </div>
  );
}
