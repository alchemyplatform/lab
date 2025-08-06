import { ponder } from "ponder:registry";
import { getConfig } from "./utils/chains";
import { bundles, poolManagers, pools, tokens } from "ponder:schema";
import { zeroAddress } from "viem";
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol, fetchTokenTotalSupply } from "./utils/token";

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  console.log(event.args);

  const config = getConfig(context.chain.name);

  const poolManagerAddress = config.poolManagerAddress;
  const whitelistTokens = config.whitelistTokens;
  const tokenOverrides = config.tokenOverrides;
  const poolsToSkip = config.poolsToSkip;
  const stablecoinWrappedNativePoolId = config.stablecoinWrappedNativePoolId;
  const stablecoinIsToken0 = config.stablecoinIsToken0;
  const wrappedNativeAddress = config.wrappedNativeAddress;
  const stablecoinAddresses = config.stablecoinAddresses;
  const minimumNativeLocked = config.minimumNativeLocked;
  const nativeTokenDetails = config.nativeTokenDetails;

  const poolId = event.args.id;

  if (poolsToSkip.includes(poolId)) {
    return
  }

  // load pool manager
  let poolManager = await context.db.find(poolManagers, { id: poolManagerAddress });

  if (poolManager === null) {
    poolManager = await context.db.insert(poolManagers).values({
      id: poolManagerAddress,
      poolCount: 0n,
      totalVolumeETH: 0,
      totalVolumeUSD: 0,
      untrackedVolumeUSD: 0,
      totalFeesUSD: 0,
      totalFeesETH: 0,
      totalValueLockedUSD: 0,
      totalValueLockedETH: 0,
      totalValueLockedUSDUntracked: 0,
      totalValueLockedETHUntracked: 0,
      txCount: 0n,
      owner: zeroAddress,
    });

    // create new bundle for tracking eth price
    // TODO: why id: 1?
    await context.db.insert(bundles).values({
      id: '1',
      ethPriceUsd: 0
    });
  }

  const poolCount = poolManager.poolCount + 1n;

  const pool = await context.db.insert(pools).values({
    id: poolId,
    createdAtTimestamp: event.block.timestamp,
    createdAtBlockNumber: event.block.number,
  });

  let token0 = await context.db.find(tokens, { id: event.args.currency0 });
  let token1 = await context.db.find(tokens, { id: event.args.currency1 });

  // fetch info if null
  if (token0 === null) {
    const tokenAddress = event.args.currency0;

    const symbol = await fetchTokenSymbol(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    const name = await fetchTokenName(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    const totalSupply = await fetchTokenTotalSupply(context.client, tokenAddress);

    const decimals = await fetchTokenDecimals(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    token0 = await context.db.insert(tokens).values({
      id: tokenAddress,
      symbol,
      name,
      decimals,
      totalSupply,
      // TODO: use defaults in schema instead?
      derivedETH: 0,
      volume: 0,
      volumeUSD: 0,
      feesUSD: 0,
      untrackedVolumeUSD: 0,
      totalValueLocked: 0,
      totalValueLockedUSD: 0,
      totalValueLockedUSDUntracked: 0,
      txCount: 0n,
      poolCount: 0n,
      // whitelistPools
    });

    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      console.debug('mybug the decimal on token 0 was null', [])
      return;
    }
  }

  if (token1 === null) {
    const tokenAddress = event.args.currency1;

    const symbol = await fetchTokenSymbol(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    const name = await fetchTokenName(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    const totalSupply = await fetchTokenTotalSupply(context.client, tokenAddress);

    const decimals = await fetchTokenDecimals(context.client, tokenAddress, tokenOverrides, nativeTokenDetails);

    token1 = await context.db.insert(tokens).values({
      id: tokenAddress,
      symbol,
      name,
      decimals,
      totalSupply,
      // TODO: use defaults in schema instead?
      derivedETH: 0,
      volume: 0,
      volumeUSD: 0,
      feesUSD: 0,
      untrackedVolumeUSD: 0,
      totalValueLocked: 0,
      totalValueLockedUSD: 0,
      totalValueLockedUSDUntracked: 0,
      txCount: 0n,
      poolCount: 0n,
      // whitelistPools
    });

    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      console.debug('mybug the decimal on token 1 was null', [])
      return;
    }
  }

  // update white listed pools
  if (whitelistTokens.includes(token0.id)) {
    const newPools = token1.whitelistPools
    newPools.push(pool.id)
    token1.whitelistPools = newPools
  }
  if (whitelistTokens.includes(token1.id)) {
    const newPools = token0.whitelistPools
    newPools.push(pool.id)
    token0.whitelistPools = newPools
  }

  pool.token0 = token0.id
  pool.token1 = token1.id
  pool.feeTier = BigInt.fromI32(event.params.fee)
  pool.hooks = event.params.hooks.toHexString()
  pool.tickSpacing = BigInt.fromI32(event.params.tickSpacing)
  pool.createdAtTimestamp = event.block.timestamp
  pool.createdAtBlockNumber = event.block.number
  pool.liquidityProviderCount = ZERO_BI
  pool.txCount = ZERO_BI
  pool.liquidity = ZERO_BI
  pool.sqrtPrice = ZERO_BI
  pool.token0Price = ZERO_BD
  pool.token1Price = ZERO_BD
  pool.observationIndex = ZERO_BI
  pool.totalValueLockedToken0 = ZERO_BD
  pool.totalValueLockedToken1 = ZERO_BD
  pool.totalValueLockedUSD = ZERO_BD
  pool.totalValueLockedETH = ZERO_BD
  pool.totalValueLockedUSDUntracked = ZERO_BD
  pool.volumeToken0 = ZERO_BD
  pool.volumeToken1 = ZERO_BD
  pool.volumeUSD = ZERO_BD
  pool.feesUSD = ZERO_BD
  pool.untrackedVolumeUSD = ZERO_BD

  pool.collectedFeesToken0 = ZERO_BD
  pool.collectedFeesToken1 = ZERO_BD
  pool.collectedFeesUSD = ZERO_BD

  pool.sqrtPrice = event.params.sqrtPriceX96
  pool.tick = BigInt.fromI32(event.params.tick)

  const prices = sqrtPriceX96ToTokenPrices(pool.sqrtPrice, token0, token1, nativeTokenDetails)
  pool.token0Price = prices[0]
  pool.token1Price = prices[1]

  pool.save()
  token0.save()
  token1.save()
  poolManager.save()

  // update prices
  // update ETH price now that prices could have changed
  const bundle = Bundle.load('1')!
  bundle.ethPriceUSD = getNativePriceInUSD(stablecoinWrappedNativePoolId, stablecoinIsToken0)
  bundle.save()
  updatePoolDayData(poolId, event)
  updatePoolHourData(poolId, event)
  token1.derivedETH = findNativePerToken(token1, wrappedNativeAddress, stablecoinAddresses, minimumNativeLocked)
  token0.derivedETH = findNativePerToken(token0, wrappedNativeAddress, stablecoinAddresses, minimumNativeLocked)

  token0.save()
  token1.save()
});

ponder.on("PoolManager:ModifyLiquidity", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  console.log(event.args);
});