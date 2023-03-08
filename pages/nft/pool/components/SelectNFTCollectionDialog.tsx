import { useMemo, useState } from "react";

import SearchBox from "@/components/Header/SearchBox";
import Modal from "@/components/Modal";
import useUserNFTs, { IOwnerCollection } from "@/hooks/useUserNFTs";

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  onSelect: (item: IOwnerCollection) => void;
}

const SelectNFTCollectionDialog = ({ isOpen, onDismiss, onSelect }: Props) => {
  const { data } = useUserNFTs();
  const [q, setQ] = useState("");

  const collectionList = useMemo(() => {
    return data ? Object.values(data) : [];
  }, [data]);
  const filteredList = useMemo(() => {
    if (!q) return collectionList || [];
    return (collectionList || []).filter((collection) =>
      collection.name.toLowerCase().includes(q.toLowerCase())
    );
  }, [collectionList, q]);

  const isEmpty = useMemo(() => {
    return filteredList.length === 0;
  }, [filteredList.length]);

  return (
    <Modal
      title="Select NFT"
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth="480px"
    >
      <div className="pt-5">
        <SearchBox
          className="mb-5 w-full"
          value={q}
          onChange={(val) => setQ(val || "")}
        />
        <div className="h-64 w-full space-y-2 overflow-auto">
          {isEmpty ? (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm">Empty results</span>
            </div>
          ) : (
            <>
              {filteredList.map((item) => {
                return (
                  <button
                    key={item.name}
                    type="button"
                    className="flex w-full items-center justify-start rounded-lg border border-[#E6E8F0] bg-transparent px-3 py-2 transition-colors hover:bg-slate-100"
                    onClick={() => onSelect(item)}
                  >
                    <div className="flex flex-col items-start justify-center">
                      <span className="font-Inter text-lg font-semibold text-text-default">
                        {item.name}
                      </span>
                      <span className="text-sm text-text-default">
                        {item.tokens?.length || 0} items
                      </span>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SelectNFTCollectionDialog;
