const url = "https://dashboard.alchemy.com/api/create-webhook";

const webhookUrl = "https://64ea3087530b.ngrok.app";

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Alchemy-Token": Deno.env.get("X_ALCHEMY_TOKEN")!,
  },
  body: JSON.stringify({
    webhook_url: webhookUrl,
    network: "ETH_SEPOLIA",
    webhook_type: "GRAPHQL",
    graphql_query: {
      skip_empty_messages: true,
      query: `{
        block {
          number
          hash
          logs(
            filter: {
              addresses: [
                # ERC721 - Contract we deployed
                "0x07c39105a9BD23dA07d728B7d5D7b8B21137A634",
                
                # ERC1155 - Contract we deployed
                "0xe4a99f34be5f749aad26cbcfd6b9213ac8bc0589",
              ],
              topics: [
                [
                  # ERC721 - Transfer 	
                  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",

                  # ERC1155 - TransferSingle
                  "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",

                  # ERC1155 - TransferBatch
                  "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb"
                ]
              ]
            }
          ) {
            account {
              address
            }
            topics
            data
            index
            transaction {
              block {
                number
                hash
              }
              hash
              index
            }
          }
        }
      }`,
    },
  }),
});

const json = await response.json();
console.log(json);
