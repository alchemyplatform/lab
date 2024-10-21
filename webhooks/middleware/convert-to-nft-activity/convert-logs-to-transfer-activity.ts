import type { GraphQlToNftActivity } from "../../utils/schemas/convert.ts";

export function convertLogsToTransferActivity(payload: GraphQlToNftActivity) {
  // const {
  //   hash: blockHash,
  //   number: blockNumber,
  //   logs,
  // } = payload.event.data.block;

  // const activity = logs
  //   .map((log) => {
  //     const decodedLog = decodeLog(log);
  //     if (!decodedLog) {
  //       return null;
  //     }

  //     if (decodedLog.type === "erc20" && decodedLog.category === "transfer") {
  //       return convertToErc20TransferActivity({
  //         blockHash,
  //         blockNumber,
  //         log,
  //         decodedLog,
  //       });
  //     }

  //     if (decodedLog.type === "erc721" && decodedLog.category === "transfer") {
  //       return convertToErc721TransferActivity({
  //         blockHash,
  //         blockNumber,
  //         log,
  //         decodedLog,
  //       });
  //     }

  //     if (decodedLog.type === "erc1155" && decodedLog.category === "transfer") {
  //       return convertToErc1155TransferActivity({
  //         blockHash,
  //         blockNumber,
  //         log,
  //         decodedLog,
  //       });
  //     }

  //     return null;
  //   })
  //   .filter((item) => item !== null);

  const {
    hash: blockHash,
    number: blockNumber,
    logs,
  } = payload.event.data.block;

  const activity = logs.flatMap((log) => {
    const decodedLog = decodeLog(log);
    if (!decodedLog) {
      return [];
    }

    const isErc721Transfer =
      decodedLog.type === "erc721" && decodedLog.category === "transfer";
    const isErc1155Transfer =
      decodedLog.type === "erc1155" && decodedLog.category === "transfer";

    if (!isErc721Transfer && !isErc1155Transfer) {
      return [];
    }

    const fromAddress = decodedLog.args.from.toLowerCase();
    const toAddress = decodedLog.args.to.toLowerCase();
    const contractAddress = log.account.address;
    const blockNum = toHex(blockNumber);
    const hash = log.transaction.hash;
    const log2 = {
      address: contractAddress,
      topics: log.topics,
      data: log.data,
      blockNumber: toHex(blockNumber),
      transactionHash: hash,
      transactionIndex: toHex(log.transaction.index),
      blockHash,
      logIndex: toHex(log.index),
      // TODO: remove field below
      removed: false,
    };

    if (isErc721Transfer) {
      const category = "erc721";
      return {
        fromAddress,
        toAddress,
        contractAddress,
        blockNum,
        hash,
        erc721TokenId: toHex(decodedLog.args.tokenId),
        category,
        log: log2,
      };
    }

    if (isErc1155Transfer) {
      const isBatchTransfer = decodedLog.eventName === "TransferBatch";
      const erc1155Metadata = isBatchTransfer
        ? decodedLog.args.ids.map((tokenId: string, i: number) => ({
            tokenId: toHex(tokenId),
            value: toHex(decodedLog.args.values[i]),
          }))
        : [
            {
              tokenId: toHex(decodedLog.args.id),
              value: toHex(decodedLog.args.value),
            },
          ];
      const category = "erc1155";

      const activityItem = {
        fromAddress,
        toAddress,
        contractAddress,
        blockNum,
        hash,
        erc1155Metadata,
        category,
        log: log2,
      };

      const numTokens = isBatchTransfer ? decodedLog.args.ids.length : 1;
      return new Array(numTokens).fill(activityItem);
    }
  });

  return activity;
}
