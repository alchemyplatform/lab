import { decodeEventLog, parseAbi, type Hex } from "npm:viem";
import {
  ERC1155_APPROVAL_FOR_ALL,
  ERC1155_TRANSFER_BATCH,
  ERC1155_TRANSFER_SINGLE,
  ERC20_APPROVAL,
  ERC20_TRANSFER,
  ERC20_TRANSFER_ABI,
  ERC721_APPROVAL,
  ERC721_APPROVAL_FOR_ALL,
  ERC721_TRANSFER,
  ERC_20_APPROVAL_ABI,
  ERC_721_APPROVAL_ABI,
  ERC_721_APPROVAL_FOR_ALL_ABI,
  ERC_721_TRANSFER_ABI,
} from "./signatures.ts";
import { ERC_1155_TRANSFER_SINGLE_ABI } from "./signatures.ts";
import { ERC_1155_TRANSFER_BATCH_ABI } from "./signatures.ts";

type Log = {
  data: string;
  topics: string[];
};

function decodeErc20Transfer(log: Log) {
  return decodeEventLog({
    abi: parseAbi([ERC20_TRANSFER_ABI]),
    data: log.data as Hex,
    topics: log.topics as [Hex, Hex, Hex],
  });
}

function decodeErc20Approval(log: Log) {
  return decodeEventLog({
    abi: parseAbi([ERC_20_APPROVAL_ABI]),
    data: log.data as Hex,
    topics: log.topics as [Hex, Hex, Hex],
  });
}

function decodeErc721Transfer(log: Log) {
  return decodeEventLog({
    abi: parseAbi([ERC_721_TRANSFER_ABI]),
    data: log.data as Hex,
    topics: log.topics as [Hex, Hex, Hex, Hex],
  });
}

function decodeErc721Approval(log: Log) {
  return decodeEventLog({
    abi: parseAbi([ERC_721_APPROVAL_ABI]),
    data: log.data as Hex,
    topics: log.topics as [Hex, Hex, Hex, Hex],
  });
}

function decodeErc721ApprovalForAll(log: Log) {
  return decodeEventLog({
    abi: parseAbi([ERC_721_APPROVAL_FOR_ALL_ABI]),
    data: log.data as Hex,
    topics: log.topics as [Hex, Hex, Hex],
  });
}

function decodeErc1155TransferSingle(log: Log) {
  return decodeEventLog({
    abi: parseAbi([ERC_1155_TRANSFER_SINGLE_ABI]),
    data: log.data as Hex,
    topics: log.topics as [Hex, Hex, Hex, Hex, Hex],
  });
}

function decodeErc1155TransferBatch(log: Log) {
  return decodeEventLog({
    abi: parseAbi([ERC_1155_TRANSFER_BATCH_ABI]),
    data: log.data as Hex,
    topics: log.topics as [Hex, Hex, Hex, Hex, Hex],
  });
}

function decodeErc1155ApprovalForAll(log: Log) {
  throw new Error("Not implemented");
}

export function decodeLog({ signature, log }: { signature: string; log: Log }) {
  switch (signature) {
    case ERC20_TRANSFER:
    case ERC721_TRANSFER: {
      if (log.topics.length === 3) {
        return decodeErc20Transfer(log);
      } else if (log.topics.length === 4) {
        return decodeErc721Transfer(log);
      }
      throw new Error("Invalid event");
    }

    case ERC20_APPROVAL:
    case ERC721_APPROVAL: {
      if (log.topics.length === 3) {
        return decodeErc20Approval(log);
      } else if (log.topics.length === 4) {
        return decodeErc721Approval(log);
      }
      throw new Error("Invalid event");
    }

    case ERC721_APPROVAL_FOR_ALL: {
      return decodeErc721ApprovalForAll(log);
    }

    case ERC1155_TRANSFER_SINGLE: {
      return decodeErc1155TransferSingle(log);
    }

    case ERC1155_TRANSFER_BATCH: {
      return decodeErc1155TransferBatch(log);
    }

    case ERC1155_APPROVAL_FOR_ALL: {
      return decodeErc1155ApprovalForAll(log);
    }
  }
}
