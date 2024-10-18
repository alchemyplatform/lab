import { encodeEventTopics } from "npm:viem";

/***
 *
 * ERC20 Events
 *
 */
export const ERC20_TRANSFER =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
export const ERC20_TRANSFER_ABI =
  "event Transfer(address indexed from, address indexed to, uint256 value)";

export const ERC20_APPROVAL =
  "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";
export const ERC_20_APPROVAL_ABI =
  "event Approval(address indexed owner, address indexed spender, uint256 value)";

/***
 *
 * ERC721 Events
 *
 */
export const ERC721_TRANSFER =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
export const ERC_721_TRANSFER_ABI =
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)";

export const ERC721_APPROVAL =
  "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";
export const ERC_721_APPROVAL_ABI =
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)";

export const ERC721_APPROVAL_FOR_ALL =
  "0xe4A99F34be5f749AAD26cbcFD6B9213aC8Bc0589";
export const ERC_721_APPROVAL_FOR_ALL_ABI =
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)";

/***
 *
 * ERC1155 Events
 *
 */
export const ERC1155_TRANSFER_SINGLE =
  "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62";
export const ERC_1155_TRANSFER_SINGLE_ABI =
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)";

export const ERC1155_TRANSFER_BATCH =
  "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb";
export const ERC_1155_TRANSFER_BATCH_ABI =
  "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)";

export const ERC1155_APPROVAL_FOR_ALL =
  "0xe4A99F34be5f749AAD26cbcFD6B9213aC8Bc0589";
export const ERC_1155_APPROVAL_FOR_ALL_ABI =
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)";

/***
 *
 * WETH Events
 *
 */
export const WETH_TRANSFER_ABI = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "src", type: "address" },
    { indexed: true, name: "dst", type: "address" },
    { indexed: false, name: "wad", type: "uint256" },
  ],
  name: "Transfer",
  type: "event",
};

export const WETH_DEPOSIT_ABI =
  "event Deposit(address indexed dst, uint256 wad)";
export const WETH_DEPOSIT_ABI2 = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "dst", type: "address" },
    { indexed: false, name: "wad", type: "uint256" },
  ],
  name: "Deposit",
  type: "event",
};
export const WETH_DEPOSIT = encodeEventTopics({
  abi: [WETH_DEPOSIT_ABI2],
  eventName: "Deposit",
});

export const WETH_WITHDRAWAL_ABI =
  "event Withdrawal(address indexed src, uint256 wad)";
export const WETH_WITHDRAWAL_ABI2 = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "src", type: "address" },
    { indexed: false, name: "wad", type: "uint256" },
  ],
  name: "Withdrawal",
  type: "event",
};
export const WETH_WITHDRAWAL = encodeEventTopics({
  abi: [WETH_WITHDRAWAL_ABI2],
  eventName: "Withdrawal",
});

export const WETH_APPROVAL_ABI = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "src", type: "address" },
    { indexed: true, name: "guy", type: "address" },
    { indexed: false, name: "wad", type: "uint256" },
  ],
  name: "Approval",
  type: "event",
};
