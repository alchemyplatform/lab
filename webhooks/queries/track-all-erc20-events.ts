export const QUERY_TRACK_ALL_ERC20_EVENTS = `{
  block {
    hash
    number
    logs(
      filter: {
        addresses: [
          # USDC contract address on Ethereum
          # https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
          "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        ]
        topics: [
          # event Transfer(address indexed from, address indexed to, uint256 value)
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

          # event Approval(address indexed owner, address indexed spender, uint256 value)
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
        ]
      }
    ) {
      data
      topics
      index
      account {
        address
      }
      transaction {
        hash
        index
      }
    }
  }
}
`;
