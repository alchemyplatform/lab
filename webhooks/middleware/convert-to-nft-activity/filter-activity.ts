import type {
  NftActivityErc1155Transfer,
  NftActivityErc721Transfer,
  NftActivityTransfer,
} from "../../utils/schemas/nft-activity.ts";

type NftFilter = {
  nftAddress: string;
  tokenId: string;
};

type FilterActivityInput = {
  activity: NftActivityTransfer[];
  filters: NftFilter[];
};

export function filterActivity({
  activity,
  filters,
}: FilterActivityInput): NftActivityTransfer[] {
  // Note - if filter includes all, return all activity
  // This is also the behaviour if no filters are provided
  const hasIncludeAllFilter = filters.some(
    (f) => f.nftAddress === "*" && f.tokenId === "*"
  );
  if (hasIncludeAllFilter) {
    return activity;
  }

  return activity.filter((a) => {
    if (a.category === "erc721") {
      return filterErc721Transfer({ activity: a, filters });
    } else if (a.category === "erc1155") {
      return filterErc1155Transfer({ activity: a, filters });
    } else {
      return false;
    }
  });
}

type FilterErc721TransferInput = {
  activity: NftActivityErc721Transfer;
  filters: NftFilter[];
};
function filterErc721Transfer({
  activity,
  filters,
}: FilterErc721TransferInput): boolean {
  const contractAddress = activity.contractAddress;
  const tokenId = activity.erc721TokenId;
}

type FilterErc1155TransferInput = {
  activity: NftActivityErc1155Transfer;
  filters: NftFilter[];
};
function filterErc1155Transfer({
  activity,
  filters,
}: FilterErc1155TransferInput): boolean {}
