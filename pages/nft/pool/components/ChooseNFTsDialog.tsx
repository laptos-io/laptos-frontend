import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useCallback, useMemo, useState } from "react";
import { useSet } from "react-use";

import Modal from "@/components/Modal";
import { IOwnerCollection, OwnerTokens } from "@/hooks/useUserNFTs";

interface Props {
  isOpen: boolean;
  collection: IOwnerCollection;
  onDismiss: () => void;
  onSelect: (items: OwnerTokens) => void;
}

const ChooseNFTsDialog = ({
  isOpen,
  collection,
  onDismiss,
  onSelect,
}: Props) => {
  const [set, { has, add, remove }] = useSet<string>();

  const toggle = useCallback(
    (hash: string) => {
      if (has(hash)) {
        remove(hash);
      } else {
        add(hash);
      }
    },
    [add, has, remove]
  );

  const onComfirm = useCallback(() => {
    const items = collection.tokens?.filter((item) =>
      has(item.token_data_id_hash)
    );
    onSelect(items);
    onDismiss();
  }, [collection.tokens, has, onDismiss, onSelect]);

  return (
    <Modal
      title="Select NFT"
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth="800px"
    >
      <div className="pt-5">
        <div className="grid grid-cols-6 gap-4">
          {(collection.tokens || []).map((item, index) => {
            return (
              <button
                type="button"
                key={item.token_data_id_hash}
                className={`relative col-span-1`}
                onClick={() => toggle(item.token_data_id_hash)}
              >
                <div className="w-full rounded-lg bg-gradient-to-r from-slate-200 to-blue-900 pt-[100%]">
                  <div className="text-xs">{item.name}</div>
                </div>
                {has(item.token_data_id_hash) ? (
                  <div className="absolute top-2 right-2">
                    <CheckCircleIcon className="h-6 w-6 text-orange-500" />
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex mt-5 w-full justify-center">
          <button
            className="rounded-lg border border-primary px-4 py-2 leading-6 text-primary hover:bg-primary hover:text-white"
            onClick={onComfirm}
          >
            Select {set.size} {collection.name}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChooseNFTsDialog;
