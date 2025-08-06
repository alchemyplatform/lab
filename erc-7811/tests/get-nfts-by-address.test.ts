import { expect, it, describe } from "bun:test";
import { getNftsByAddress } from "../helpers/get-nfts-by-address";
import { GetNftsByAddressResponse } from "../schemas/portfolio/get-nfts-by-address";
import { parse, ValiError } from "valibot";


const key = process.env.ALCHEMY_API_KEY;
const url = `https://api.g.alchemy.com/data/v1/${key}/assets/nfts/by-address`;

// vitalik.eth
const account = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

describe('getNftsByAddress', () => {
  describe('if no address field is provided', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        addresses: [
          {
            networks: ['eth-mainnet']
          }
        ],
      }),
    });
    const json = await response.json();

    it("should return 'missing required parameter' error", () => expect(json).toStrictEqual({
      error: {
        message: "Missing required parameter: address"
      }
    }));
  });

  describe('if null address is provided', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        addresses: [
          {
            address: null,
            networks: ['eth-mainnet']
          }
        ],
      }),
    });
    const json = await response.json();

    it("should return 'missing required parameter' error", () => expect(json).toStrictEqual({
      error: {
        message: "Missing required parameter: address"
      }
    }));
  });

  describe('if invalid address is provided', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        addresses: [
          {
            address: "0x123",
            networks: ['eth-mainnet']
          }
        ],
      }),
    });
    const json = await response.json();

    it("should return 'address is invalid' error", () => expect(json).toStrictEqual({
      error: {
        message: "Address is not valid."
      }
    }));
  });

  describe('if empty address array is provided', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        addresses: [
          {
            address: [],
            networks: ['eth-mainnet']
          }
        ],
      }),
    });
    const json = await response.json();

    // TODO: update this error message
    it("[bug] should return 'cannot deserialize value' error", () => expect(json).toStrictEqual({
      "error": {
        "message": "Cannot deserialize value of type `java.lang.String` from Array value (token `JsonToken.START_ARRAY`)\n at [Source: UNKNOWN; byte offset: #UNKNOWN] (through reference chain: java.util.ArrayList[0]->alchemy.eapiservice.handlers.assets.nfts.entities.NftsRequestModel$NftsByAddressRequestBodyEntry[\"address\"])"
      }
    }));
  });

  describe('if no networks field is provided', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        addresses: [
          {
            address: account,
          }
        ],
      }),
    });
    const json = await response.json();

    // TODO: update this error message to "Missing required parameter: networks"
    it("[bug] should return 'internal server error' error", () => expect(json).toStrictEqual({
      "error": {
        "message": "Internal server error"
      }
    }));
  });

  describe('if empty network array is provided', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        addresses: [
          {
            address: account,
            networks: []
          }
        ],
      }),
    });
    const json = await response.json();

    it("should return 'invalid number of networks' error", () => expect(json).toStrictEqual({
      error: {
        message: "Invalid number of networks (1-15 allowed)."
      }
    }));
  });

  describe('if null networks is provided', async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        addresses: [
          {
            address: account,
            networks: null
          }
        ],
      }),
    });
    const json = await response.json();

    // TODO: update this error message to "Invalid number of networks (1-15 allowed)."
    it("[bug] should return 'internal server error' error", () => expect(json).toStrictEqual({
      "error": {
        "message": "Internal server error"
      }
    }));
  });

  describe("if more than 15 networks are provided", async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        addresses: [
          {
            address: account,
            networks: [
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              'eth-mainnet',
              // More than 15 networks
              'eth-mainnet'
            ]
          }
        ],
      }),
    });
    const json = await response.json();

    it("should return 'invalid number of networks' error", () => expect(json).toStrictEqual({
      error: {
        message: "Invalid number of networks (1-15 allowed)."
      }
    }));
  });

  describe("if 1 address and 1 network are provided", () => {
    it('should pass valibot validation (without metadata)', () => {
      expect(async () => {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            addresses: [
              {
                address: account,
                networks: [
                  'eth-mainnet'
                ]
              }
            ],
          }),
        });
        const json = await response.json();
        parse(GetNftsByAddressResponse, json);
      }).not.toThrow();
    });

    it('should pass valibot validation (with metadata)', () => {
      expect(async () => {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            addresses: [
              {
                address: account,
                networks: [
                  'eth-mainnet',
                  'polygon-mainnet',
                  'opt-mainnet',
                  'base-mainnet',
                ]
              }
            ],
            withMetadata: true
          }),
        });
        const json = await response.json();
        try {
          parse(GetNftsByAddressResponse, json);
        } catch (error) {
          if (error instanceof ValiError) {
            console.log(error.issues[0].path.map(p => p.key).join('.'));
            console.log(error.issues[0]);
          }
          throw error;
        }
      }).not.toThrow();
    });
  });
});