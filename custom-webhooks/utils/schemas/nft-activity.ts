const erc721 = {
  webhookId: "wh_yq51m67bytws4rk8",
  id: "whevt_afs8eq2g8v8wu514",
  createdAt: "2024-10-15T21:04:01.355Z",
  type: "NFT_ACTIVITY",
  event: {
    network: "ETH_SEPOLIA",
    activity: [
      {
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0x93f9ecdaf22f8b60bc24641dd5ed43ca92405cb7",
        contractAddress: "0x07c39105a9bd23da07d728b7d5d7b8b21137a634",
        blockNum: "0x69047e",
        hash: "0x8e9617ecd2b46996d98a00f20da8cf31b332121494b7dfa77808b7f16853eaff",
        erc721TokenId: "0xd",
        category: "erc721",
        log: {
          address: "0x07c39105a9bd23da07d728b7d5d7b8b21137a634",
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x00000000000000000000000093f9ecdaf22f8b60bc24641dd5ed43ca92405cb7",
            "0x000000000000000000000000000000000000000000000000000000000000000d",
          ],
          data: "0x",
          blockNumber: "0x69047e",
          transactionHash:
            "0x8e9617ecd2b46996d98a00f20da8cf31b332121494b7dfa77808b7f16853eaff",
          transactionIndex: "0x4c",
          blockHash:
            "0xa25c879dbe6facac33310aab0ce771daa09ca6b820679102b62c1220dc469835",
          logIndex: "0x4e",
          removed: false,
        },
      },
    ],
  },
};

const erc1155 = {
  webhookId: "wh_yq51m67bytws4rk8",
  id: "whevt_yp2fw69pdk3mo1tf",
  createdAt: "2024-10-15T19:47:13.758Z",
  type: "NFT_ACTIVITY",
  event: {
    network: "ETH_SEPOLIA",
    activity: [
      {
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: "0x93f9ecdaf22f8b60bc24641dd5ed43ca92405cb7",
        contractAddress: "0xe4a99f34be5f749aad26cbcfd6b9213ac8bc0589",
        blockNum: "0x690335",
        hash: "0x0156d50e23600c1a256dc5a8a9783459fc1e40df2b22fe3168503d0c7ffe3be4",
        erc1155Metadata: [
          {
            tokenId: "0x0",
            value: "0xa",
          },
        ],
        category: "erc1155",
        log: {
          address: "0xe4a99f34be5f749aad26cbcfd6b9213ac8bc0589",
          topics: [
            "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
            "0x00000000000000000000000016c3a8563631dec0e3360c6a6bffc190ec41b99f",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x00000000000000000000000093f9ecdaf22f8b60bc24641dd5ed43ca92405cb7",
          ],
          data: "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a",
          blockNumber: "0x690335",
          transactionHash:
            "0x0156d50e23600c1a256dc5a8a9783459fc1e40df2b22fe3168503d0c7ffe3be4",
          transactionIndex: "0x4f",
          blockHash:
            "0xc3a8e0065d564137509d174784733e071937a3219dbbb6f3d191c00d68b2b4c1",
          logIndex: "0x65",
          removed: false,
        },
      },
    ],
  },
};
